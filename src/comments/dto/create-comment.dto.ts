export class CreateCommentDto {
  comment_id?: string;
  post_id?: string;
  users_id?: string;
  comment?: string;
  create_date?: Date;
}
