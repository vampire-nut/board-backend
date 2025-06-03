/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// posts.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create post', () => {
    it('should call postsService.create with the correct DTO', async () => {
      const createPostDto: CreatePostDto = {
        users_id: 'user1',
        title: 'Test Post',
        content: 'This is a test post.',
        category: 'Technology',
      };
      mockPostsService.create.mockResolvedValue({ success: true, code: 200 });
      await controller.create(createPostDto);
      expect(service.create).toHaveBeenCalledWith(createPostDto);
    });

    it('should return the result from postsService.create', async () => {
      const createPostDto: CreatePostDto = {
        users_id: 'user1',
        title: 'Test Post',
        content: 'This is a test post.',
        category: 'Technology',
      };
      const expectedResult = { success: true, code: 200 };
      mockPostsService.create.mockResolvedValue(expectedResult);
      const result = await controller.create(createPostDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Get findAll', () => {
    it('should call postsService.findAll with the correct body', async () => {
      const body = { category: 'Community', search: 'keyword' };
      mockPostsService.findAll.mockResolvedValue({
        success: true,
        code: 200,
        data: [],
      });
      await controller.findAll(body);
      expect(service.findAll).toHaveBeenCalledWith(body);
    });

    it('should return the result from postsService.findAll', async () => {
      const body = { category: 'Community', search: 'keyword' };
      const expectedResult = {
        success: true,
        code: 200,
        data: [{ title: 'Test' }],
      };
      mockPostsService.findAll.mockResolvedValue(expectedResult);
      const result = await controller.findAll(body);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Get findById', () => {
    it('should call postsService.findById with the correct users_id', async () => {
      const users_id = 'user123';
      mockPostsService.findById.mockResolvedValue({
        success: true,
        code: 200,
        data: [],
      });
      await controller.findById(users_id);
      expect(service.findById).toHaveBeenCalledWith(users_id);
    });

    it('should return the result from postsService.findById', async () => {
      const users_id = 'user123';
      const expectedResult = {
        success: true,
        code: 200,
        data: [{ title: 'User Post' }],
      };
      mockPostsService.findById.mockResolvedValue(expectedResult);
      const result = await controller.findById(users_id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update post', () => {
    it('should call postsService.update with the correct DTO', async () => {
      const updatePostDto: UpdatePostDto = {
        post_id: 'post123',
        title: 'Updated Title',
        content: 'Updated Content',
      };
      mockPostsService.update.mockResolvedValue({ success: true, code: 200 });
      await controller.update(updatePostDto);
      expect(service.update).toHaveBeenCalledWith(updatePostDto);
    });

    it('should return the result from postsService.update', async () => {
      const updatePostDto: UpdatePostDto = {
        post_id: 'post123',
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const expectedResult = { success: true, code: 200 };
      mockPostsService.update.mockResolvedValue(expectedResult);
      const result = await controller.update(updatePostDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove post', () => {
    it('should call postsService.remove with the correct id', async () => {
      const postId = 'post123';
      mockPostsService.remove.mockResolvedValue({ success: true, code: 200 });
      await controller.remove(postId);
      expect(service.remove).toHaveBeenCalledWith(postId);
    });

    it('should return the result from postsService.remove', async () => {
      const postId = 'post123';
      const expectedResult = { success: true, code: 200 };
      mockPostsService.remove.mockResolvedValue(expectedResult);
      const result = await controller.remove(postId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne post', () => {
    it('should call postsService.findOne with the correct post_id', async () => {
      const postId = 'post123';
      mockPostsService.findOne.mockResolvedValue({
        success: true,
        code: 200,
        data: {},
      });
      await controller.findOne(postId);
      expect(service.findOne).toHaveBeenCalledWith(postId);
    });

    it('should return the result from postsService.findOne', async () => {
      const postId = 'post123';
      const expectedResult = {
        success: true,
        code: 200,
        data: { title: 'Single Post' },
      };
      mockPostsService.findOne.mockResolvedValue(expectedResult);
      const result = await controller.findOne(postId);
      expect(result).toEqual(expectedResult);
    });
  });
});
