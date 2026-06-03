import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from '@prisma/client';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(SessionGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async createNote(@CurrentUserId() userId: string, @Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return await this.notesService.createNote(userId, createNoteDto);
  }

  @Get()
  async findAllNotesForAmbitionId(@CurrentUserId() userId: string, @Query('ambitionId') ambitionId: string): Promise<Note[]> {
    return await this.notesService.findAllNotesForAmbitionId(userId, ambitionId);
  }

  @Get(':noteId')
  async findOneNoteById(@CurrentUserId() userId: string, @Param('noteId') noteId: string): Promise<Note | null> {
    return await this.notesService.findOneNoteById(userId, noteId);
  }

  @Patch(':noteId')
  async updateNoteById(@CurrentUserId() userId: string, @Param('noteId') noteId: string, @Body() updateNoteDto: UpdateNoteDto): Promise<Note> {
    return await this.notesService.updateNoteById(userId, noteId, updateNoteDto);
  }

  @Delete(':noteId')
  async removeNoteById(@CurrentUserId() userId: string, @Param('noteId') noteId: string): Promise<Note> {
    return await this.notesService.removeNoteById(userId, noteId);
  }
}
