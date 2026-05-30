import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from './entities/note.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(NoteEntity) private readonly notesRepository: Repository<NoteEntity>) {}

  async createNote(token: string, createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    const user = await this.notesRepository.manager
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .innerJoin('sessions', 'session', 'session.user_id = user.id')
      .select('user.id', 'id')
      .where('session.token = :token', { token })
      .getRawOne<{ id: string }>();

    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid or expired session token');
    }

    return await this.notesRepository.save({
      id: crypto.randomUUID(),
      userId: user.id,
      ...createNoteDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // TODO: Implement all the notes for an ambition endpoint
  findAllNotesForAmbitionId(ambitionId: string) {
    return `This action returns all notes for ambition with id ${ambitionId}`;
  }

  async findOneNoteById(noteId: string): Promise<NoteEntity | null> {
    try {
      return await this.notesRepository.findOne({ where: { id: noteId } });
    } catch (error) {
      console.error(`Error finding note with id ${noteId}:`, error);
      throw new HttpException('Failed to find note', 500);
    }
  }

  async updateNote(noteId: string, updateNoteDto: UpdateNoteDto): Promise<NoteEntity> {
    const note = await this.findOneNoteById(noteId);
    if (!note) {
      throw new HttpException('Note not found', 404);
    }

    Object.assign(note, {
      ...note,
      note: updateNoteDto.note,
      updatedAt: new Date(),
    });
    return await this.notesRepository.save(note);
  }

  async removeNote(noteId: string) {
    try {
      const note = await this.findOneNoteById(noteId);
      if (!note) {
        throw new HttpException('Note not found', 404);
      }
      return await this.notesRepository.remove(note);
    } catch (error) {
      console.error(`Error removing note with id ${noteId}:`, error);
      throw new HttpException('Failed to remove note', 500);
    }
  }
}
