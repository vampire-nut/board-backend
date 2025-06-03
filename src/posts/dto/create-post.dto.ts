export class CreatePostDto {
  post_id?: string;
  users_id: string;
  title: string;
  content: string;
  category: string;
}
