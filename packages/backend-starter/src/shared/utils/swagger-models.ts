import { ApiProperty } from '@nestjs/swagger';
import {
  IPostAttributes,
  IPostTagAttributes,
  ITagAttributes,
} from '../../models';
import { PostType } from '../../post/constants/post.constant';

class PostTagSwaggerModel implements IPostTagAttributes {
  @ApiProperty()
  postId: string;

  @ApiProperty()
  tagId: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}

export class TagSwaggerModel implements ITagAttributes {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => PostTagSwaggerModel })
  PostTagEntity: PostTagSwaggerModel;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}

export class PostSwaggerModel implements IPostAttributes {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  mainImage: string;

  @ApiProperty()
  images?: string;

  @ApiProperty({ enum: Object.values(PostType) })
  type: (typeof PostType)[keyof typeof PostType];

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => PostTagSwaggerModel })
  PostTagEntity: PostTagSwaggerModel;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
