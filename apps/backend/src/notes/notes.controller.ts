import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteEntity } from './entities/note.entity';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(SessionGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async createNote(@CurrentUserId() userId: string, @Body() createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    return await this.notesService.createNote(userId, createNoteDto);
  }

  // route changed to avoid conflict with noteId route
  @Get('ambition/:ambitionId')
  async findAllNotesForAmbitionId(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string): Promise<NoteEntity[]> {
    return await this.notesService.findAllNotesForAmbitionId(userId, ambitionId);
  }

  @Get(':noteId')
  async findOneNoteById(@CurrentUserId() userId: string, @Param('noteId') noteId: string): Promise<NoteEntity | null> {
    return await this.notesService.findOneNoteById(userId, noteId);
  }

  @Patch(':noteId')
  async updateNoteById(@CurrentUserId() userId: string, @Param('noteId') noteId: string, @Body() updateNoteDto: UpdateNoteDto): Promise<NoteEntity> {
    return await this.notesService.updateNoteById(userId, noteId, updateNoteDto);
  }

  @Delete(':noteId')
  async removeNoteById(@CurrentUserId() userId: string, @Param('noteId') noteId: string): Promise<NoteEntity> {
    return await this.notesService.removeNoteById(userId, noteId);
  }
}
