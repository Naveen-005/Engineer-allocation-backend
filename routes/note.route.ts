import express from "express";
import NoteController from "../controllers/note.controller";
import { NoteService } from "../services/note.service";

const noteRouter = express.Router();

// Directly instantiate the service (it already uses dataSource internally)
const noteService = new NoteService();
const noteController = new NoteController(noteService, noteRouter);

export default noteRouter;
export { noteService };
