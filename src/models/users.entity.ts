import { UUIDV4 } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Post } from './post.entity';

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class Users extends Model {
  @PrimaryKey
  @IsUUID('all')
  @Default(UUIDV4)
  @AllowNull(false)
  @Column({ field: 'users_id', type: DataType.STRING(50) })
  users_id: string;

  @Column({ field: 'username', type: DataType.STRING(50) })
  username: string;

  @CreatedAt
  @Column
  create_date: Date;

  @UpdatedAt
  @Column
  modify_date: Date;

  @Column({ field: 'modify_by', type: DataType.STRING(50) })
  modify_by: string | null;

  @DeletedAt
  @Column
  delete_date: Date;

  @Column({ field: 'delete_by', type: DataType.STRING(50) })
  delete_by: string | null;

  @Default(false)
  @Column({ field: 'is_delete', type: DataType.BOOLEAN })
  is_delete: boolean;

  @HasMany(() => Post)
  posts: Post;
}
