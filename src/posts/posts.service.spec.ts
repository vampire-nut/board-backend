/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// posts.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/sequelize';
import { Post } from '../models/post.entity';
import { NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { Users } from '../models/users.entity';
import { Comment } from '../models/comment.entity';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postModel: typeof Post;

  const mockPostModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post),
          useValue: mockPostModel,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postModel = module.get<typeof Post>(getModelToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post if no existing post with same user and title', async () => {
      const createPostDto = {
        users_id: 'user1',
        title: 'New Post',
        content: 'Content',
        category: 'Tech',
      };
      mockPostModel.findOne.mockResolvedValue(null);
      mockPostModel.create.mockResolvedValue({});

      const result = await service.create(createPostDto);
      expect(mockPostModel.findOne).toHaveBeenCalledWith({
        attributes: ['post_id', 'users_id', 'title', 'content', 'category'],
        where: {
          users_id: createPostDto.users_id,
          title: createPostDto.title,
          is_delete: false,
        },
      });
      expect(mockPostModel.create).toHaveBeenCalledWith(createPostDto);
      expect(result).toEqual({ success: true, code: 200 });
    });

    it('should return 500 and NotFoundException on error', async () => {
      const createPostDto = {
        users_id: 'user1',
        title: 'Error Post',
        content: 'Content',
        category: 'Tech',
      };
      const error = new Error('Database error');
      mockPostModel.findOne.mockRejectedValue(error);
      jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await service.create(createPostDto);
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(500);
      expect(result.error).toBeInstanceOf(NotFoundException);
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('findAll', () => {
    it('should return all posts with users and comments', async () => {
      const body = { category: 'Technology', search: 'nestjs' };
      const mockPosts = [
        {
          users_id: 'u1',
          title: 'NestJS Basics',
          content: 'Learning NestJS',
          category: 'Technology',
          toJSON: () => ({
            users_id: 'u1',
            title: 'NestJS Basics',
            content: 'Learning NestJS',
            category: 'Technology',
            comments: [{ comment_id: 'c1' }],
          }),
        },
        {
          users_id: 'u2',
          title: 'ExpressJS vs NestJS',
          content: 'Comparing frameworks',
          category: 'Technology',
          toJSON: () => ({
            users_id: 'u2',
            title: 'ExpressJS vs NestJS',
            content: 'Comparing frameworks',
            category: 'Technology',
            comments: [],
          }),
        },
      ];
      mockPostModel.findAll.mockResolvedValue(mockPosts);

      const result = await service.findAll(body);
      expect(mockPostModel.findAll).toHaveBeenCalledWith({
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
            { title: { [Op.substring]: body.search } },
            { content: { [Op.substring]: body.search } },
          ],
          category: body.category,
        },
      });
      expect(result.success).toBeTruthy();
      expect(result.data.length).toBe(2);
      expect(result.data[0].totalComments).toBe(1);
      expect(result.data[1].totalComments).toBe(0);
    });

    it('should handle "Community" category by not applying category filter', async () => {
      const body = { category: 'Community', search: 'news' };
      mockPostModel.findAll.mockResolvedValue([]);

      await service.findAll(body);
      expect(mockPostModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            is_delete: false,
            [Op.or]: [
              { title: { [Op.substring]: body.search } },
              { content: { [Op.substring]: body.search } },
            ],
          },
        }),
      );
    });

    it('should return 500 and NotFoundException on error', async () => {
      const body = { category: 'Technology', search: 'error' };
      const error = new Error('FindAll error');
      mockPostModel.findAll.mockRejectedValue(error);
      jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await service.findAll(body);
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(500);
      expect(result.error).toBeInstanceOf(NotFoundException);
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('findById', () => {
    it('should return posts by users_id with is_edit and is_delete flags', async () => {
      const users_id = 'user123';
      const mockRows = [
        {
          users_id: 'user123',
          title: 'My Post 1',
          content: 'Content 1',
          category: 'General',
          toJSON: () => ({
            users_id: 'user123',
            title: 'My Post 1',
            content: 'Content 1',
            category: 'General',
          }),
        },
      ];
      mockPostModel.findAndCountAll.mockResolvedValue({
        rows: mockRows,
        count: 1,
      });

      const result = await service.findById(users_id);
      expect(mockPostModel.findAndCountAll).toHaveBeenCalledWith({
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
      expect(result.success).toBeTruthy();
      expect(result.data[0]).toHaveProperty('is_edit', true);
      expect(result.data[0]).toHaveProperty('is_delete', true);
      expect(result.count).toBe(1);
    });

    it('should return 500 and NotFoundException on error', async () => {
      const users_id = 'error_user';
      const error = new Error('FindById error');
      mockPostModel.findAndCountAll.mockRejectedValue(error);
      jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await service.findById(users_id);
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(500);
      expect(result.error).toBeInstanceOf(NotFoundException);
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('findOne', () => {
    it('should return a single post with user and comments', async () => {
      const post_id = 'post123';
      const mockPost = {
        post_id: 'post123',
        users_id: 'u1',
        title: 'Single Post',
        content: 'Content',
        category: 'News',
        toJSON: () => ({
          post_id: 'post123',
          users_id: 'u1',
          title: 'Single Post',
          content: 'Content',
          category: 'News',
          user: { username: 'user_a' },
          comments: [
            {
              comment_id: 'c1',
              comment: 'Good post',
              user: { username: 'commenter1' },
            },
          ],
        }),
      };
      mockPostModel.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne(post_id);
      expect(mockPostModel.findOne).toHaveBeenCalledWith({
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
      expect(result.success).toBeTruthy();
      expect(result.data).toEqual(mockPost.toJSON());
    });

    it('should return 404 if post is not found', async () => {
      const post_id = 'nonexistent_post';
      mockPostModel.findOne.mockResolvedValue(null);

      const result = await service.findOne(post_id);
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(404);
      expect(result.error).toBeInstanceOf(NotFoundException);
      expect(result.error.message).toBe('Find not found.');
    });

    it('should return 500 and NotFoundException on error', async () => {
      const post_id = 'error_post';
      const error = new Error('FindOne error');
      mockPostModel.findOne.mockRejectedValue(error);
      jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await service.findOne(post_id);
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(500);
      expect(result.error).toBeInstanceOf(NotFoundException);
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update an existing post', async () => {
      const updatePostDto: UpdatePostDto = {
        post_id: 'post123',
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const mockPostInstance = {
        update: jest.fn().mockResolvedValue(true),
      };
      mockPostModel.findByPk.mockResolvedValue(mockPostInstance);

      const result = await service.update(updatePostDto);
      expect(mockPostModel.findByPk).toHaveBeenCalledWith(
        updatePostDto.post_id,
      );
      expect(mockPostInstance.update).toHaveBeenCalledWith(updatePostDto);
      expect(result).toEqual({ success: true, code: 200 });
    });

    it('should return 404 if post to update is not found', async () => {
      const updatePostDto: UpdatePostDto = {
        post_id: 'nonexistent_post',
        title: 'Updated Title',
        content: 'Updated Content',
      };
      mockPostModel.findByPk.mockResolvedValue(null);

      const result = await service.update(updatePostDto);
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(404);
      expect(result.error).toBeInstanceOf(NotFoundException);
      expect(result.error.message).toBe('Find not found.');
    });

    it('should return 500 and NotFoundException on error', async () => {
      const updatePostDto: UpdatePostDto = {
        post_id: 'error_post',
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const error = new Error('Update error');
      mockPostModel.findByPk.mockRejectedValue(error);
      jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await service.update(updatePostDto);
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(500);
      expect(result.error).toBeInstanceOf(NotFoundException);
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const postId = 'post123';
      mockPostModel.findOne.mockResolvedValue({ post_id: postId });
      mockPostModel.destroy.mockResolvedValue(1); // 1 row affected

      const result = await service.remove(postId);
      expect(mockPostModel.findOne).toHaveBeenCalledWith({
        where: { post_id: postId },
      });
      expect(mockPostModel.destroy).toHaveBeenCalledWith({
        where: {
          post_id: postId,
        },
        force: true,
      });
      expect(result).toEqual({ success: true, code: 200 });
    });

    it('should return 404 if post to remove is not found', async () => {
      const postId = 'nonexistent_post';
      mockPostModel.findOne.mockResolvedValue(null);

      const result = await service.remove(postId);
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(404);
      expect(result.error).toBeInstanceOf(NotFoundException);
      expect(result.error.message).toBe('Find not found.');
    });

    it('should return 500 and NotFoundException on error', async () => {
      const postId = 'error_post';
      const error = new Error('Remove error');
      mockPostModel.findOne.mockRejectedValue(error);
      jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await service.remove(postId);
      expect(result.success).toBeFalsy();
      expect(result.code).toBe(500);
      expect(result.error).toBeInstanceOf(NotFoundException);
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });
});
