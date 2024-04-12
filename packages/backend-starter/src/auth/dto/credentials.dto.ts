import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(32)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}
