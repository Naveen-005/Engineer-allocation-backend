import { LoggerService } from "./logger.service";
import dataSource from "../db/data-source";
import { User } from "../entities/userEntities/user.entity";
import UserRepository from "../repositories/userRepository/user.repository";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type IntentType = "RESOURCE_QUERY" | "SMALL_TALK" | "UNKNOWN";

interface ParsedIntent {
  designation: string | null;
  skill: string | null;
}

interface ChatbotResult {
  id: string;
  name: string;
  email: string;
  experience: number;
}

interface ChatbotResponse {
  query: string;
  intentType: IntentType;
  parsedIntent: ParsedIntent;
  results: ChatbotResult[];
  message: string;
}

export class ChatbotService {
  private userRepo = new UserRepository(dataSource.getRepository(User));
  private logger = LoggerService.getInstance(ChatbotService.name);

  private skillSynonymMap: Record<string, string> = {
    "node.js": "NODEJS",
    "nodejs": "NODEJS",
    "node": "NODEJS",
    "react.js": "REACT",
    "react": "REACT",
    "aws": "AWS",
    "amazon web services": "AWS",
    "azure": "AZURE",
    "flutter": "FLUTTER",
    "vue": "VUEJS",
    "vuejs": "VUEJS",
    "nextjs": "NEXTJS",
    "next.js": "NEXTJS",
    "next": "NEXTJS",
    "docker": "DOCKER",
    "devops": "DOCKER", // Optional mapping
  };

  async processQuery(query: string): Promise<ChatbotResponse> {
    try {
      const { results, parsedIntent, intentType, message } = await this.handleQuery(query);

      const mappedResults: ChatbotResult[] = results.map((e) => ({
        id: e.user_id,
        name: e.name,
        email: e.email,
        experience: e.experience ?? 0,
      }));

      return {
        query,
        intentType,
        parsedIntent,
        results: mappedResults,
        message,
      };
    } catch (err) {
      this.logger.error(`Chatbot error: ${err}`);
      throw err;
    }
  }

  private async handleQuery(query: string) {
    this.logger.info(`Processing chatbot query: ${query}`);

    const intentType = await this.classifyIntentType(query);
    this.logger.info(`Intent type: ${intentType}`);

    if (intentType === "SMALL_TALK") {
      const message = await this.generateSmallTalkResponse();
      return {
        intentType,
        parsedIntent: { designation: null, skill: null },
        results: [],
        message,
      };
    }

    if (intentType === "UNKNOWN") {
      return {
        intentType,
        parsedIntent: { designation: null, skill: null },
        results: [],
        message:
          "🤖 I help with engineer allocation. You can ask me about available developers, skills, or teams!",
      };
    }

    let parsedIntent = await this.extractIntent(query);
    this.logger.info(`Parsed intent: ${JSON.stringify(parsedIntent)}`);

    if (parsedIntent.designation?.toLowerCase() === "engineer") {
      this.logger.warn(`Generic designation \"${parsedIntent.designation}\" detected — ignoring designation filter.`);
      parsedIntent.designation = null;
    }

    // Normalize skill using synonym map
    if (parsedIntent.skill) {
      parsedIntent.skill = this.normalizeSkill(parsedIntent.skill);
      this.logger.info(`Normalized skill: ${parsedIntent.skill}`);
    }

    if (!parsedIntent.designation && !parsedIntent.skill) {
      return {
        intentType,
        parsedIntent,
        results: [],
        message:
          "⚠️ I couldn't detect a specific skill or role in your query. Try asking like:\n• 'Need a QA engineer'\n• 'Find Python developers'",
      };
    }

    const engineers = await this.userRepo.findAvailableEngineers(parsedIntent);
    this.logger.info(`Found ${engineers.length} matching engineers`);

    if (engineers.length === 0) {
      return {
        intentType,
        parsedIntent,
        results: [],
        message: `🔍 No engineers found for \"${query}\". Try modifying your skill or designation.`,
      };
    }

    return {
      intentType,
      parsedIntent,
      results: engineers,
      message: `✅ Found ${engineers.length} engineer(s):\n${engineers
        .map((e) => `- ${e.name} (${e.email})`)
        .join("\n")}`,
    };
  }

  private normalizeSkill(rawSkill: string): string {
    const cleaned = rawSkill.toLowerCase().replace(/\./g, "").trim();
    return this.skillSynonymMap[cleaned] || rawSkill.toUpperCase();
  }

  private async classifyIntentType(query: string): Promise<IntentType> {
    const systemPrompt = `
You're an assistant that classifies queries into categories.
Possible categories:
- "RESOURCE_QUERY": if user is asking to find engineers, developers, team members, etc.
- "SMALL_TALK": if user says hi, asks what you do, how you are, thanks, etc.
- "UNKNOWN": if it’s unclear or irrelevant.

Return only one: RESOURCE_QUERY, SMALL_TALK, or UNKNOWN.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      temperature: 0,
    });

    const type = completion.choices[0].message.content?.trim().toUpperCase();
    if (type === "RESOURCE_QUERY" || type === "SMALL_TALK" || type === "UNKNOWN") {
      return type as IntentType;
    }
    return "UNKNOWN";
  }

  private async extractIntent(query: string): Promise<ParsedIntent> {
    const systemPrompt = `
You are a backend service that extracts structured filters from user queries about engineers.
Given a natural language query, return a JSON object with:
- designation (like "Frontend Engineer", "Backend Developer", etc)
- skill (like "React", "Node.js", "Python", etc)

If not mentioned, leave them as null.

Examples:
"show me react developers"
→ { "designation": null, "skill": "React" }

"need backend engineer good at Node"
→ { "designation": "Backend Engineer", "skill": "Node" }

"who are the available QAs?"
→ { "designation": "QA Engineer", "skill": null }
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices[0].message.content?.trim() || "{}";

    try {
      const parsed = JSON.parse(raw);
      return {
        designation: parsed.designation ?? null,
        skill: parsed.skill ?? null,
      };
    } catch (err) {
      this.logger.error(`Failed to parse OpenAI response: ${err}`);
      return { designation: null, skill: null };
    }
  }

  private async generateSmallTalkResponse(): Promise<string> {
    const systemPrompt = `
You are a helpful and friendly assistant for an Engineer Allocation Platform.

Generate a short message that:
1. Greets the user naturally (e.g., Hi, Hello, Hey there)
2. States your role (helping with engineer allocation)
3. Gives 1–2 examples of questions the user can ask (like "Find React developers" or "Any backend engineers?")

Keep it brief, polite, and vary the tone/phrasing each time.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "User said hi. Generate the response." },
      ],
      temperature: 0.7,
    });

    return (
      completion.choices[0].message.content?.trim() ||
      "Hi! I'm here to help you with engineer allocation. You can ask about available developers or teams."
    );
  }
}
