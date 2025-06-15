import express, { Request, Response } from "express";
import dataSource from "./db/data-source";

import { errorMiddleware } from "./middlewares/errorMiddleware";
import {authRouter} from "./routes/auth.route"

import cors from "cors";
import projectRouter from "./routes/project.route";

const server = express();

server.use(cors())
server.use(express.json());

server.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello world");
});


server.use("/auth", authRouter);
server.use("/project", projectRouter)

server.use(errorMiddleware);

(async()=>{
  try{
    await dataSource.initialize();
    console.log('Database connected');
  }catch (e){
    console.error(`Failed to connect to DB - ${e}`)
    process.exit(1);
  }
  server.listen(3000, () => {
    console.info("server listening to 3000");
  });
})();


