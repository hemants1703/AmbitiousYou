import { IsNotEmpty, IsString } from 'class-validator';

// Editing a note only changes its text, so we validate `note` on its own here.
// Extending PartialType(CreateNoteDto) reintroduced `ambitionId` (which defaults to '')
// and failed @IsNotEmpty on every update, so the standalone shape is intentional.
export class UpdateNoteDto {
  @IsString()
  @IsNotEmpty()
  note: string = '';
}
