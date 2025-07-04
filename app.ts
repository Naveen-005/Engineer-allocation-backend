import express, { Request, Response } from "express";
import dataSource from "./db/data-source";
import noteRouter from "./routes/note.route";

import { errorMiddleware } from "./middlewares/errorMiddleware";
import { authRouter } from "./routes/auth.route";

import cors from "cors";
import projectRouter from "./routes/project.route";
import userRouter from "./routes/user.route";
import { authMiddleware } from "./middlewares/authMiddleware";
import { LoggerService } from "./services/logger.service";
import designationRouter from "./routes/designation.route";
import skillRouter from "./routes/skill.route";
import auditLogRouter from "./routes/auditLog.route";
import chatbotRouter from "./routes/chatbot.route";
import aiReportRouter from "./routes/aiReport.route";
import skillRequirementRouter from "./routes/skillRequirement.route";

const logger = LoggerService.getInstance("app.ts");
const server = express();

server.use(cors());
server.use(express.json());

server.get("/", (req: Request, res: Response) => {
  logger.info("Received GET /");
  res.status(200).send("Hello world");
});

server.use("/designations", designationRouter);
server.use("/skills", skillRouter);
server.use("/auth", authRouter);
server.use("/project",authMiddleware, projectRouter);
server.use("/projects", noteRouter);
server.use("/chatbot", chatbotRouter);
server.use("/users", userRouter);
server.use("/audit-logs", auditLogRouter);
server.use("/report", aiReportRouter);
server.use("/skill-requirements", skillRequirementRouter);

server.use(errorMiddleware);

(async () => {
  try {
    await dataSource.initialize();
    logger.info("Database connected");
  } catch (e) {
    logger.error(`Failed to connect to DB - ${e}`);
    process.exit(1);
  }

  server.listen(5000, () => {
    logger.info("Server listening on port 5000");
  });
})();
