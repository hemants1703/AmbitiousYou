import { IsBoolean, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CreateAmbitionDto } from './create-ambition.dto';

export class UpdateAmbitionDto extends CreateAmbitionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80, { message: 'ambitionName must be 80 characters or fewer' })
  ambitionName: string = '';

  @IsString()
  ambitionDefinition: string = '';

  @IsEnum(['low', 'medium', 'high'])
  ambitionPriority: 'low' | 'medium' | 'high' = 'low';

  @IsBoolean()
  isFavourited: boolean = false;
}
