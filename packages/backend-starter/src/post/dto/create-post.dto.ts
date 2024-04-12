import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PostType } from '../constants/post.constant';

export class CreatePostDto {
  @MaxLength(80)
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(2000000)
  @MinLength(10)
  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(PostType)
  @IsOptional()
  type: (typeof PostType)[keyof typeof PostType];

  @IsBoolean()
  @IsOptional()
  published: boolean;
}
