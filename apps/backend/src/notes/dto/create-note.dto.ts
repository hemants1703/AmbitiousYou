import { NewNote } from 'src/db';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto implements NewNote {
  @IsString()
  @IsNotEmpty()
  ambitionId: string = '';

  @IsString()
  @IsNotEmpty()
  note: string = '';
}
