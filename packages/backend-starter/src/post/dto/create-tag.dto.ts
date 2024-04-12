import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;
}
