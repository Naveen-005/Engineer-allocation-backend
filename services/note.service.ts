import { Note } from '../entities/note.entity';
import dataSource from '../db/data-source';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { User } from '../entities/userEntities/user.entity';
import { Project } from '../entities/projectEntities/project.entity';
import ProjectRepository from '../repositories/projectRepository/project.repository';
import UserRepository from '../repositories/userRepository/user.repository';
import { LoggerService } from '../services/logger.service';

export class NoteService {
  private noteRepo = dataSource.getRepository(Note);
  private userRepo = new UserRepository(dataSource.getRepository(User));
  private projectRepo = new ProjectRepository(dataSource.getRepository(Project));
  private logger = LoggerService.getInstance(NoteService.name);

  async addNote(dto: CreateNoteDto): Promise<Note> {
    this.logger.info(`Adding note to project ${dto.projectId} by user ${dto.authorId}`);

    const project = await this.projectRepo.findOneByProjectId(dto.projectId);
    const author = await this.userRepo.findOneById(dto.authorId);

    if (!project || !author) {
      this.logger.error('Project or Author not found');
      throw new Error('Project or Author not found');
    }

    const note = this.noteRepo.create({
      content: dto.content,
      author,
      project,
    });

    const savedNote = await this.noteRepo.save(note);
    this.logger.info(`Note ${savedNote.id} created successfully`);
    return savedNote;
  }

  async listNotes(projectId: string): Promise<Note[]> {
    this.logger.info(`Fetching notes for project ${projectId}`);

    const notes = await this.noteRepo.find({
      where: {
        project: { project_id: projectId },
      },
      relations: ['project', 'author'],
      order: { createdAt: 'DESC' },
    });

    this.logger.info(`Fetched ${notes.length} notes`);
    return notes;
  }

  async updateNote(id: number, dto: UpdateNoteDto): Promise<Note> {
    this.logger.info(`Updating note ${id}`);

    const note = await this.noteRepo.findOneBy({ id });
    if (!note) {
      this.logger.error(`Note ${id} not found`);
      throw new Error('Note not found');
    }

    note.content = dto.content;
    const updatedNote = await this.noteRepo.save(note);

    this.logger.info(`Note ${id} updated successfully`);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<void> {
    this.logger.info(`Deleting note ${id}`);

    const note = await this.noteRepo.findOneBy({ id });
    if (!note) {
      this.logger.error(`Note ${id} not found`);
      throw new Error('Note not found');
    }

    await this.noteRepo.softRemove(note);
    this.logger.info(`Note ${id} deleted successfully`);
  }
}
