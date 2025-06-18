// src/services/chatbot.service.ts
import { LoggerService } from "./logger.service";
import dataSource from "../db/data-source";
import { User } from "../entities/userEntities/user.entity";
import UserRepository from "../repositories/userRepository/user.repository";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export class ChatbotService {
  private userRepo = new UserRepository(dataSource.getRepository(User));
  private logger = LoggerService.getInstance(ChatbotService.name);

  /**
   * Public method exposed to the controller
   * @param query user input message
   * @returns string bot reply
   */
  async processQuery(query: string): Promise<string> {
    try {
      const { results, parsedIntent } = await this.handleQuery(query);

      if (results.length === 0) {
        return `🤖 Sorry, I couldn’t find any available engineers matching your query: "${query}".`;
      }

      const engineerList = results
        .map((e) => `- ${e.name} (${e.designations})`)
        .join("\n");

      return `✅ Found ${results.length} matching engineer(s):\n${engineerList}`;
    } catch (err) {
      this.logger.error(`Chatbot error: ${err}`);
      return "⚠️ Sorry, something went wrong while processing your request.";
    }
  }

  /**
   * Handles full flow: OpenAI intent extraction → DB query
   */
  private async handleQuery(query: string) {
    this.logger.info(`Processing chatbot query: ${query}`);

    // Step 1: Extract intent using OpenAI
    const parsedIntent = await this.extractIntent(query);
    this.logger.info(`Parsed intent: ${JSON.stringify(parsedIntent)}`);

    // Step 2: Query DB using extracted intent
    const engineers = await this.userRepo.findAvailableEngineers(parsedIntent);
    this.logger.info(`Found ${engineers.length} matching engineers`);

    return { results: engineers, parsedIntent };
  }

  /**
   * Uses OpenAI to parse designation and skill from user's question
   */
  private async extractIntent(query: string): Promise<{
    designation?: string;
    skill?: string;
  }> {
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
      model: "gpt-4o", // or gpt-3.5-turbo
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
