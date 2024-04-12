import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @MaxLength(200)
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  name: string;
}
