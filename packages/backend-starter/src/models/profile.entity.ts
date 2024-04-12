import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { BaseEntity, IBaseAttributes, UserEntity } from '.';

export interface IProfileAttributes extends IBaseAttributes {
  bio?: string;
  firstName?: string;
  lastName?: string;
  userId: string;
}

interface IProfileCreationAttributes
  extends Optional<
    IProfileAttributes,
    | 'id'
    | 'bio'
    | 'firstName'
    | 'lastName'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  > {}

@Table({ tableName: 'Profiles' })
export class ProfileEntity extends BaseEntity<
  IProfileAttributes,
  IProfileCreationAttributes
> {
  @ApiProperty()
  @Column
  bio?: string;

  @ApiProperty()
  @Column
  firstName?: string;

  @ApiProperty()
  @Column
  lastName?: string;

  @ApiProperty()
  @ForeignKey(() => UserEntity)
  userId: string;

  @BelongsTo(() => UserEntity)
  user: UserEntity;
}
