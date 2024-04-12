import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PostType } from '../constants/post.constant';

export class UpdatePostDto {
  @MaxLength(80)
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(2000000)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(PostType)
  @IsNotEmpty()
  type: (typeof PostType)[keyof typeof PostType];

  @IsBoolean()
  @IsNotEmpty()
  published: boolean;
}
