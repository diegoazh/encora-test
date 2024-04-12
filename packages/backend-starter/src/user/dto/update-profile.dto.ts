import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @MaxLength(10000)
  @MinLength(30)
  @IsString()
  @IsNotEmpty()
  bio: string;

  @MaxLength(100)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(100)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
