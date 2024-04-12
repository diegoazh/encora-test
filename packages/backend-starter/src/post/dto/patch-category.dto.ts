import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class PatchCategoryDto extends PartialType(CreateCategoryDto) {
  @MaxLength(200)
  @MinLength(5)
  @IsString()
  @IsOptional()
  name?: string;
}
