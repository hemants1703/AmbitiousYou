import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Note } from '@prisma/client';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(userId: string, createNoteDto: CreateNoteDto): Promise<Note> {
    return await this.prisma.note.create({
      data: { userId, ...createNoteDto },
    });
  }

  async findAllNotesForAmbitionId(userId: string, ambitionId: string): Promise<Note[]> {
    return await this.prisma.note.findMany({ where: { ambitionId, userId } });
  }

  async findOneNoteById(userId: string, noteId: string): Promise<Note | null> {
    return await this.prisma.note.findFirst({ where: { id: noteId, userId } });
  }

  async updateNoteById(userId: string, noteId: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOneNoteById(userId, noteId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return await this.prisma.note.update({
      where: { id: note.id },
      data: { note: updateNoteDto.note },
    });
  }

  async removeNoteById(userId: string, noteId: string): Promise<Note> {
    const note = await this.findOneNoteById(userId, noteId);
    if (!note) {
      throw new BadRequestException('Note not found');
    }

    return await this.prisma.note.delete({ where: { id: note.id } });
  }
}
