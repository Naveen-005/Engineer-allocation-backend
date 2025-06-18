import { Request, Response, NextFunction, Router } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ChatRequestDto } from "../dto/chatbot-request.dto";
import HttpException from "../exceptions/httpException";
import { ChatbotService } from "../services/chatbot.service";
import { LoggerService } from "../services/logger.service";

class ChatbotController {
  constructor(private chatbotService: ChatbotService, router: Router) {
    router.post("/", this.handleQuery.bind(this));
  }

  async handleQuery(req: Request, res: Response, next: NextFunction) {
    const logger = new LoggerService("ChatbotController");
    try {
      const dto = plainToInstance(ChatRequestDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }

      logger.info(`Processing chatbot query: ${dto.query}`);

      const response = await this.chatbotService.processQuery(dto.query);

      logger.info(`Parsed intent: ${JSON.stringify(response.parsedIntent)}`);
      logger.info(
        `Found ${response.results ? response.results.length : 0} matching engineers`
      );

      return res.status(200).json({
        query: dto.query,
        parsedIntent: response.parsedIntent,
        results: response.results
          ? response.results.map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              experience: user.experience,
            }))
          : [],
      });
    } catch (err) {
      logger.error(`Chatbot error: ${err}`);
      next(err);
    }
  }
}

export default ChatbotController;
