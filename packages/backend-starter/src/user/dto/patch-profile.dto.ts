import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PatchProfileDto {
  @MaxLength(10000)
  @MinLength(30)
  @IsString()
  @IsOptional()
  bio?: string;

  @MaxLength(100)
  @MinLength(3)
  @IsString()
  @IsOptional()
  firstName?: string;

  @MaxLength(100)
  @MinLength(3)
  @IsString()
  @IsOptional()
  lastName?: string;
}
