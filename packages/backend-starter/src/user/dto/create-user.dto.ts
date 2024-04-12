import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(32, { message: 'user_pwd_max_length' })
  @MinLength(8, { message: 'user_pwd_min_length' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(32, { message: 'user_username_max_length' })
  @MinLength(4, { message: 'user_username_min_length' })
  @IsString()
  @IsOptional()
  username?: string;
}
