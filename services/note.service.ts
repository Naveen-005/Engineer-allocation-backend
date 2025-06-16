import { Note } from '../entities/note.entity';

import dataSource from '../db/data-source';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { User } from '../entities/userEntities/user.entity';
import { Project } from '../entities/projectEntities/project.entity';
import ProjectRepository from '../repositories/projectRepository/project.repository';
import UserRepository from '../repositories/userRepository/user.repository';

export class NoteService {
  private noteRepo = dataSource.getRepository(Note);
  private userRepo = new UserRepository(dataSource.getRepository(User));
  private projectRepo = new ProjectRepository(dataSource.getRepository(Project));

  async addNote(dto: CreateNoteDto): Promise<Note> {
    const project = await this.projectRepo.findOneByProjectId(dto.projectId );
    const author = await this.userRepo.findOneById(dto.authorId);
    console.log(project)

    if (!project || !author) {
      throw new Error('Project or Author not found');
    }

    const note = this.noteRepo.create({
      content: dto.content,
      author,
      project,
    });

    return await this.noteRepo.save(note);
  }

    async listNotes(projectId: string): Promise<Note[]> {
    return await this.noteRepo.find({
        where: {
        project: {
            project_id: projectId
        }
        },
        relations: ['project', 'author'],
        order: { createdAt: 'DESC' },
    });
    }


  async updateNote(id: number, dto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepo.findOneBy({ id });

    if (!note) {
      throw new Error('Note not found');
    }

    note.content = dto.content;
    return await this.noteRepo.save(note);
  }

  async deleteNote(id: number): Promise<void> {
    const note = await this.noteRepo.findOneBy({ id });

    if (!note) {
      throw new Error('Note not found');
    }

    await this.noteRepo.softRemove(note);
  }
}
