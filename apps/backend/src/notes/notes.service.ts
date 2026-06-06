import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { db, notes, type Note } from 'src/db';

@Injectable()
export class NotesService {
  async createNote(userId: string, createNoteDto: CreateNoteDto): Promise<Note> {
    const [created] = await db
      .insert(notes)
      .values({ userId, ...createNoteDto })
      .returning();
    return created;
  }

  async findAllNotesForAmbitionId(userId: string, ambitionId: string): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(and(eq(notes.ambitionId, ambitionId), eq(notes.userId, userId)));
  }

  async findOneNoteById(userId: string, noteId: string): Promise<Note | null> {
    const [note] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1);
    return note ?? null;
  }

  async updateNoteById(userId: string, noteId: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOneNoteById(userId, noteId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const [updated] = await db.update(notes).set({ note: updateNoteDto.note }).where(eq(notes.id, note.id)).returning();
    return updated;
  }

  async removeNoteById(userId: string, noteId: string): Promise<Note> {
    const note = await this.findOneNoteById(userId, noteId);
    if (!note) {
      throw new BadRequestException('Note not found');
    }

    const [deleted] = await db.delete(notes).where(eq(notes.id, note.id)).returning();
    return deleted;
  }
}
