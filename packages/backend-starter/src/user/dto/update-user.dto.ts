import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(32)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(32)
  @MinLength(4)
  @IsString()
  @IsNotEmpty()
  username: string;
}
