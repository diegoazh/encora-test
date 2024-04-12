import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { PostSwaggerModel } from '../shared/utils/swagger-models';
import { BaseEntity, IBaseAttributes } from './base.entity';
import { PostTagEntity } from './post-tag.entity';
import { PostEntity } from './post.entity';

export interface ITagAttributes extends IBaseAttributes {
  name: string;
}

interface ITagCreationAttributes
  extends Optional<
    ITagAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@Table({ tableName: 'Tags' })
export class TagEntity extends BaseEntity<
  ITagAttributes,
  ITagCreationAttributes
> {
  @ApiProperty()
  @Column
  name: string;

  @ApiProperty({ type: () => [PostSwaggerModel] })
  @BelongsToMany(() => PostEntity, () => PostTagEntity)
  posts: Array<PostEntity & { PostTagEntity: PostTagEntity }>;
}
