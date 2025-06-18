import { Router, Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import HttpException from '../exceptions/httpException';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { NoteService } from '../services/note.service';

class NoteController {
  constructor(private noteService: NoteService, router: Router) {
    router.post('/:projectId/notes', this.createNote.bind(this));
    router.get('/:projectId/notes', this.listNotes.bind(this));
    router.put('/:projectId/notes/:id', this.updateNote.bind(this));
    router.delete('/:projectId/notes/:id', this.deleteNote.bind(this));
  }

  async createNote(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(CreateNoteDto, {
        ...req.body,
        projectId: String(req.params.projectId),
      });

      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }

      const authorId = req.body.authorId;
      if (!authorId) {
        throw new HttpException(400, 'Missing authorId in request body');
      }

      const note = await this.noteService.addNote(dto, authorId);
      res.status(201).send(note);
    } catch (err) {
      next(err);
    }
  }

  async listNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = String(req.params.projectId);
      if (!projectId || projectId === 'undefined') {
        throw new HttpException(400, 'Invalid projectId');
      }

      const notes = await this.noteService.listNotes(projectId);
      res.status(200).send(notes);
    } catch (err) {
      next(err);
    }
  }

  async updateNote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const dto = plainToInstance(UpdateNoteDto, req.body);

      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }

      const updatedNote = await this.noteService.updateNote(id, dto);
      res.status(200).send(updatedNote);
    } catch (err) {
      next(err);
    }
  }

  async deleteNote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await this.noteService.deleteNote(id);
      res.status(200).send({ message: 'Note deleted' });
    } catch (err) {
      next(err);
    }
  }
}

export default NoteController;
