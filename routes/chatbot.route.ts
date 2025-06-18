// src/routes/chatbot.routes.ts
import express from "express";
import ChatbotController from "../controllers/chatbot.controller";
import { ChatbotService } from "../services/chatbot.service";

const chatbotRouter = express.Router();
const chatbotService = new ChatbotService();
const chatbotController = new ChatbotController(chatbotService, chatbotRouter);

export default chatbotRouter;
export { chatbotService };
