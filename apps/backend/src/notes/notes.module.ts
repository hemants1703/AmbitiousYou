import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Module({
  controllers: [NotesController],
  providers: [NotesService, SessionGuard],
})
export class NotesModule {}
