import { PartialType } from '@nestjs/mapped-types';
import { CreateAmbitionDto } from './create-ambition.dto';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAmbitionDto extends PartialType(CreateAmbitionDto) {
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
