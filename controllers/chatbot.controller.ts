// src/controllers/chatbot.controller.ts
import { Request, Response, NextFunction, Router } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ChatRequestDto } from "../dto/chatbot-request.dto";
import HttpException from "../exceptions/httpException";
import { ChatbotService } from "../services/chatbot.service";

class ChatbotController {
  constructor(private chatbotService: ChatbotService, router: Router) {
    router.post("/chatbot", this.handleQuery.bind(this));
  }

  async handleQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(ChatRequestDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }

      const result = await this.chatbotService.processQuery(dto.query);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
}

export default ChatbotController;
