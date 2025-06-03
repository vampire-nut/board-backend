import { UUIDV4 } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Users } from './users.entity';
import { Comment } from './comment.entity';

@Table({ tableName: 'post', timestamps: true, paranoid: true })
export class Post extends Model {
  @PrimaryKey
  @IsUUID('all')
  @Default(UUIDV4)
  @AllowNull(false)
  @Column({ field: 'post_id', type: DataType.STRING(50) })
  post_id: string;

  @ForeignKey(() => Users)
  @Column({ field: 'users_id', type: DataType.STRING(50) })
  users_id: string;

  @Column({ field: 'title', type: DataType.STRING(255) })
  title: string;

  @Column({ field: 'content', type: DataType.TEXT() })
  content: string;

  @Column({ field: 'category', type: DataType.STRING(100) })
  category: string;

  @CreatedAt
  @Column
  create_date: Date;

  @Column({ field: 'create_by', type: DataType.STRING(50) })
  create_by: string | null;

  @UpdatedAt
  @Column
  modify_date: Date;

  @Column({ field: 'modify_by', type: DataType.STRING(50) })
  modify_by: string | null;

  @Column({ field: 'delete_by', type: DataType.STRING(50) })
  delete_by: string | null;

  @DeletedAt
  @Column
  delete_date: Date;

  @Default(false)
  @Column({ field: 'is_delete', type: DataType.BOOLEAN })
  is_delete: boolean;

  @BelongsTo(() => Users)
  users: Users;

  @HasMany(() => Comment)
  comments: Comment;
}
