import { LoggerService } from "./logger.service";
import dataSource from "../db/data-source";
import { User } from "../entities/userEntities/user.entity";
import UserRepository from "../repositories/userRepository/user.repository";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface ParsedIntent {
  designation: string | null;
  skill: string | null;
}

interface ChatbotResult {
  id: string;
  name: string;
  email: string;
  experience: number;
  // optionally: designation/skills if you want to extend
}

interface ChatbotResponse {
  query: string;
  parsedIntent: ParsedIntent;
  results: ChatbotResult[];
}

export class ChatbotService {
  private userRepo = new UserRepository(dataSource.getRepository(User));
  private logger = LoggerService.getInstance(ChatbotService.name);

  /**
   * Public method exposed to the controller
   * @param query user input message
   * @returns structured bot response
   */
  async processQuery(query: string): Promise<ChatbotResponse> {
    try {
      const { results, parsedIntent } = await this.handleQuery(query);

      const mappedResults: ChatbotResult[] = results.map((e) => ({
        id: e.user_id,
        name: e.name,
        email: e.email,
        experience: e.experience ?? 0,
        // Add skills/designations here if needed
      }));

      return {
        query,
        parsedIntent,
        results: mappedResults,
      };
    } catch (err) {
      this.logger.error(`Chatbot error: ${err}`);
      throw err;
    }
  }

  private async handleQuery(query: string) {
    this.logger.info(`Processing chatbot query: ${query}`);

    const parsedIntent = await this.extractIntent(query);
    this.logger.info(`Parsed intent: ${JSON.stringify(parsedIntent)}`);

    const engineers = await this.userRepo.findAvailableEngineers(parsedIntent);
    this.logger.info(`Found ${engineers.length} matching engineers`);

    return { results: engineers, parsedIntent };
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
}
