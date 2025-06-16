import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import dataSource from '../db/data-source';

class NoteRepository {
  private repo: Repository<Note>;

  constructor() {
    this.repo = dataSource.getRepository(Note);
  }

  async create(note: Partial<Note>): Promise<Note> {
    const newNote = this.repo.create(note);
    return await this.repo.save(newNote);
  }

  async update(id: number, note: Partial<Note>): Promise<Note | null> {
    await this.repo.update(id, note);
    return await this.repo.findOne({
      where: { id },
      relations: ['project', 'author'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }

  async findByProject(projectId: number): Promise<Note[]> {
    return await this.repo.find({
      where: {
      project: { project_id: projectId }
      },
      relations: ['project', 'author'],
      order: { createdAt: 'DESC' },
    });
  }
}

export default new NoteRepository();
