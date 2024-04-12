import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';

export interface IBaseAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export abstract class BaseEntity<T, U> extends Model<T, U> {
  @ApiProperty()
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty()
  @CreatedAt
  createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  updatedAt: Date;

  @ApiProperty()
  @DeletedAt
  deletedAt: Date;
}
