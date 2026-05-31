import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteEntity } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(NoteEntity) private readonly notesRepository: Repository<NoteEntity>) {}

  async createNote(userId: string, createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    return await this.notesRepository.save({
      id: crypto.randomUUID(),
      userId,
      ...createNoteDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAllNotesForAmbitionId(userId: string, ambitionId: string): Promise<NoteEntity[]> {
    return await this.notesRepository.find({ where: { ambitionId, userId } });
  }

  async findOneNoteById(userId: string, noteId: string): Promise<NoteEntity | null> {
    return await this.notesRepository.findOne({ where: { id: noteId, userId } });
  }

  async updateNote(userId: string, noteId: string, updateNoteDto: UpdateNoteDto): Promise<NoteEntity> {
    const note = await this.findOneNoteById(userId, noteId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    Object.assign(note, {
      ...note,
      note: updateNoteDto.note,
      updatedAt: new Date(),
    });
    return await this.notesRepository.save(note);
  }

  async removeNote(userId: string, noteId: string): Promise<NoteEntity> {
    const note = await this.findOneNoteById(userId, noteId);
    if (!note) {
      throw new BadRequestException('Note not found');
    }

    return await this.notesRepository.remove(note);
  }
}
