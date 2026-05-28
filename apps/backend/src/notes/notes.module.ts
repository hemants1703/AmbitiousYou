import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { NoteEntity } from './entities/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/auth/entities/session.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { AmbitionEntity } from 'src/ambitions/entities/ambition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity, SessionEntity, UserEntity, AmbitionEntity])],
  controllers: [NotesController],
  providers: [NotesService, SessionGuard],
})
export class NotesModule {}
