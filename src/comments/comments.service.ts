import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from 'src/models/comment.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment) private commentModel: typeof Comment) {}

  async create(createCommentDto: CreateCommentDto): Promise<any> {
    try {
      createCommentDto.comment_id = undefined;
      createCommentDto.create_date = new Date();
      const result = await this.commentModel.create({
        create_by: createCommentDto.users_id,
        ...createCommentDto,
      });
      if (result) {
        return { success: true, code: 200 };
      } else {
        return { success: false, code: 404 };
      }
    } catch (error) {
      console.log(error);
      return { success: false, code: 500, error: new NotFoundException(error) };
    }
  }
}
