import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class PatchTagDto extends PartialType(CreateTagDto) {
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  @IsOptional()
  name?: string;
}
