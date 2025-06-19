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
  const message = await this.generateSmallTalkResponse(query); // pass actual query
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

    const details = [
  parsedIntent.designation ? `• Designation: ${parsedIntent.designation}` : null,
  parsedIntent.skill ? `• Skill: ${parsedIntent.skill}` : null,
]
  .filter(Boolean)
  .join("\n");

const engineerLines = engineers.map(
  (e, i) => `  ${i + 1}. ${e.name}\n     ✉️ ${e.email}`
);

return {
  intentType,
  parsedIntent,
  results: engineers,
  message: `✅ Based on your request:
${details ? details + "\n\n" : ""}👥 Available Engineers (${engineers.length}):
${engineerLines.length ? engineerLines.join("\n") : "  No matching engineers found."}`,
};
  }

  private normalizeSkill(rawSkill: string): string {
    const cleaned = rawSkill.toLowerCase().replace(/\./g, "").trim();
    return this.skillSynonymMap[cleaned] || rawSkill.toUpperCase();
  }

  private async classifyIntentType(query: string): Promise<IntentType> {
    const systemPrompt = `
You're an assistant that classifies user queries into categories.

Classify the user's input into one of the following:
- "RESOURCE_QUERY": if the user is asking to find engineers, developers, team members, or resources.
- "SMALL_TALK": if the user greets, says thanks, says things like "how are you", "good morning", "hello", "nice to meet you", or any non-task-specific phrase.
- "UNKNOWN": if the intent is unclear or unrelated.

Respond with only one: RESOURCE_QUERY, SMALL_TALK, or UNKNOWN.

Examples:
- "hi" → SMALL_TALK
- "how are you?" → SMALL_TALK
- "I need a React developer" → RESOURCE_QUERY
- "nice to meet you" → SMALL_TALK
- "can you help me find backend engineers?" → RESOURCE_QUERY
- "what's the time?" → UNKNOWN
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

  private async generateSmallTalkResponse(userInput: string): Promise<string> {
  try {
    const systemPrompt = `
You are a helpful and friendly assistant for an Engineer Allocation Platform.

Respond to the user's small talk naturally. Your reply should:
1. Acknowledge what the user said (e.g., "Nice to meet you too!" if they said that).
2. Optionally add your role (helping with engineer allocation and tell the user that he should give either skill or designation).
3. Be short, polite, and vary in tone.

Examples:
User: "Hi"
→ "😊 Hey there! I'm here to help with engineer allocation by the required Skill or designation"

User: "How are you?"
→ "I'm doing great, thanks for asking! How can I help you today?"

User: "Nice to meet you"
→ "😊 Nice to meet you too! Let me know what kind of developer you need."

Now reply to the user input accordingly.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }, // 🟢 USE ACTUAL INPUT HERE
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content?.trim();
    return reply || this.getFallbackGreeting();
  } catch (error) {
    return this.getFallbackGreeting();
  }
}
private getFallbackGreeting(): string {
  return "Hi! I'm here to help with engineer allocation. You can ask about available developers or teams.";
}


}
