/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/sequelize';

import { Comment } from 'src/models/comment.entity';
import { Op } from 'sequelize';
import { Users } from 'src/models/users.entity';
import { Post } from 'src/models/post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postModel: typeof Post) {}
  async create(createPostDto: CreatePostDto): Promise<any> {
    try {
      delete createPostDto.post_id;
      const findOne = await this.postModel.findOne({
        attributes: ['post_id', 'users_id', 'title', 'content', 'category'],
        where: {
          users_id: createPostDto?.users_id,
          title: createPostDto?.title,
          is_delete: false,
        },
      });

      if (findOne) {
        return { success: false, code: 403 };
      } else {
        await this.postModel.create({ ...createPostDto });
        return { success: true, code: 200 };
      }
    } catch (error) {
      console.log(error);
      return { success: false, code: 500, error: new NotFoundException(error) };
    }
  }

  async findAll(body: any): Promise<any> {
    try {
      const { category, search } = body;
      console.log(' findAll ==> ', body);
      let whereCategory: { category: string } | undefined = undefined;
      if (category != 'Community') {
        whereCategory = {
          category: category,
        };
      } else {
        whereCategory = undefined;
      }
      const findAll = await this.postModel.findAll({
        attributes: ['post_id', 'users_id', 'title', 'content', 'category'],
        include: [
          {
            model: Users,
            required: false,
            attributes: ['username'],
          },
          {
            model: Comment,
            required: false,
            attributes: [
              'comment_id',
              'post_id',
              'users_id',
              'comment',
              ['create_date', 'commentTime'],
            ],
          },
        ],
        where: {
          is_delete: false,
          [Op.or]: [
            { title: { [Op.substring]: search } },
            { content: { [Op.substring]: search } },
          ],
          ...(whereCategory ? whereCategory : {}),
        },
      });

      const newData = await Promise.all(
        findAll.map((obj: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const d = obj.toJSON();
          return {
            ...d,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            totalComments: d.comments?.length || 0,
          };
        }),
      );
      return {
        success: true,
        data: newData,
        code: 200,
      };
    } catch (error) {
      console.log(error);
      return { success: false, code: 500, error: new NotFoundException(error) };
    }
  }

  async findById(users_id: string): Promise<any> {
    try {
      const { rows, count } = await this.postModel.findAndCountAll({
        attributes: ['post_id', 'users_id', 'title', 'content', 'category'],
        include: [
          {
            model: Users,
            required: true,
            attributes: ['username'],
          },
        ],
        where: {
          users_id,
          is_delete: false,
        },
      });

      const newData = await Promise.all(
        rows.map((d: any) => ({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          ...d.toJSON(),
          is_edit: true,
          is_delete: true,
        })),
      );
      return {
        success: true,
        data: newData,
        count,
        code: 200,
      };
    } catch (error) {
      console.log(error);
      return { success: false, code: 500, error: new NotFoundException(error) };
    }
  }

  async findOne(post_id: string): Promise<any> {
    try {
      const findOne = await this.postModel.findOne({
        attributes: ['post_id', 'users_id', 'title', 'content', 'category'],
        include: [
          {
            model: Users,
            required: true,
            attributes: ['username'],
          },
          {
            model: Comment,
            required: false,
            attributes: [
              'comment_id',
              'post_id',
              'users_id',
              'comment',
              ['create_date', 'commentTime'],
            ],
            include: [
              {
                model: Users,
                required: true,
                attributes: ['username'],
              },
            ],
            order: [['commentTime', 'DESC']],
            separate: true,
          },
        ],
        where: {
          post_id,
          is_delete: false,
        },
      });

      if (findOne) {
        return {
          success: true,
          code: 200,
          data: findOne?.toJSON(),
        };
      } else {
        return {
          success: false,
          code: 404,
          error: new NotFoundException('Find not found.'),
        };
      }
    } catch (error) {
      console.log(error);
      return { success: false, code: 500, error: new NotFoundException(error) };
    }
  }

  async update(updatePostDto: UpdatePostDto): Promise<any> {
    try {
      console.log('update ==> ', updatePostDto);

      const findById = await this.postModel.findByPk(updatePostDto?.post_id);
      if (findById) {
        await findById.update(updatePostDto);

        return {
          success: true,
          code: 200,
        };
      } else {
        return {
          success: false,
          code: 404,
          error: new NotFoundException('Find not found.'),
        };
      }
    } catch (error) {
      console.log(error);
      return { success: false, code: 500, error: new NotFoundException(error) };
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const findOne = await this.postModel.findOne({ where: { post_id: id } });
      if (findOne) {
        await this.postModel.destroy({
          where: {
            post_id: id,
          },
          force: true,
        });
        return {
          success: true,
          code: 200,
        };
      } else {
        return {
          success: false,
          code: 404,
          error: new NotFoundException('Find not found.'),
        };
      }
    } catch (error) {
      console.log(error);
      return { success: false, code: 500, error: new NotFoundException(error) };
    }
  }
}
