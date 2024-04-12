import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PatchUserDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @MaxLength(32)
  @MinLength(8)
  @IsString()
  @IsOptional()
  password?: string;

  @MaxLength(32)
  @MinLength(4)
  @IsString()
  @IsOptional()
  username?: string;
}
