import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, HasOne, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes, PostEntity, ProfileEntity } from '.';
import { UserRole } from '../user/constants/user.constant';
import { CommentEntity } from './comment.entity';

export interface IUserAttributes extends IBaseAttributes {
  email: string;
  password: string;
  role: (typeof UserRole)[keyof typeof UserRole];
  username?: string;
  image?: string;
}

interface IUserCreationAttributes
  extends Optional<
    IUserAttributes,
    'id' | 'username' | 'image' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@Table({ tableName: 'Users' })
export class UserEntity extends BaseEntity<
  IUserAttributes,
  IUserCreationAttributes
> {
  @ApiProperty()
  @Column
  email: string;

  @ApiProperty()
  @Column
  password: string;

  @ApiProperty({ enum: Object.values(UserRole) })
  @Column({ type: DataType.ENUM, values: Object.values(UserRole) })
  role: (typeof UserRole)[keyof typeof UserRole];

  @ApiProperty()
  @Column
  username?: string;

  @ApiProperty()
  @Column
  image?: string;

  @HasOne(() => ProfileEntity)
  profile: ProfileEntity;

  @HasMany(() => PostEntity)
  posts: PostEntity[];

  @HasMany(() => CommentEntity)
  comments: CommentEntity[];

  toJSON(): UserEntity {
    return { ...super.toJSON(), password: '' } as any;
  }
}
