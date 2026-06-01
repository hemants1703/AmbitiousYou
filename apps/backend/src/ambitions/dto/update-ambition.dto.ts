import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateAmbitionDto } from './create-ambition.dto';

export class UpdateAmbitionDto extends CreateAmbitionDto {
  @IsString()
  @IsNotEmpty()
  ambitionName: string = '';

  @IsString()
  ambitionDefinition: string = '';

  @IsEnum(['low', 'medium', 'high'])
  ambitionPriority: 'low' | 'medium' | 'high' = 'low';

  @IsBoolean()
  isFavourited: boolean = false;
}
