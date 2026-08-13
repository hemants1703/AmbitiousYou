import { IsIn, ValidateIf } from 'class-validator';
import { PROFILE_ICON_VALUES } from 'src/db';

/**
 * Profile avatar update. `image` is a catalog value
 * (`icon:<mark>:<tone>` / `icon:none:<tone>`) or `null` for plain initials.
 */
export class UpdateUserDto {
  @ValidateIf((_object, value) => value !== null)
  @IsIn([...PROFILE_ICON_VALUES])
  image!: string | null;
}
