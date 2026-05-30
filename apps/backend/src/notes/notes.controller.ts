import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Headers } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteEntity } from './entities/note.entity';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(SessionGuard)
  @Post()
  async createNote(@Headers('Authorization') authorization: string, @Body() createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    const token = authorization.replace(/^Bearer\s+/i, '');
    return await this.notesService.createNote(token, createNoteDto);
  }

  @UseGuards(SessionGuard)
  @Get()
  findAllNotesForAmbitionId(@Query('ambitionId') ambitionId: string) {
    return this.notesService.findAllNotesForAmbitionId(ambitionId);
  }

  @UseGuards(SessionGuard)
  @Get(':noteId')
  findOneNoteById(@Param('noteId') noteId: string) {
    return this.notesService.findOneNoteById(noteId);
  }

  @UseGuards(SessionGuard)
  @Patch(':noteId')
  async update(@Param('noteId') noteId: string, @Body() updateNoteDto: UpdateNoteDto): Promise<NoteEntity> {
    return await this.notesService.updateNote(noteId, updateNoteDto);
  }

  @UseGuards(SessionGuard)
  @Delete(':noteId')
  remove(@Param('noteId') noteId: string) {
    return this.notesService.removeNote(noteId);
  }
}
