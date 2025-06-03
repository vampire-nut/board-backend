/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Comment } from 'src/models/comment.entity'; // ตรวจสอบ path ให้ถูกต้อง

describe('CommentsService', () => {
  let service: CommentsService;
  let commentModel: typeof Comment; // เพิ่มตัวแปรสำหรับ mock model

  // Mock implementation for the Comment model
  const mockCommentModel = {
    create: jest.fn(), // Mock the create method
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getModelToken(Comment), // ใช้ getModelToken สำหรับ Sequelize model
          useValue: mockCommentModel, // กำหนด mock value
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentModel = module.get<typeof Comment>(getModelToken(Comment)); // เข้าถึง mock model
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new comment and return success', async () => {
      const createCommentDto = {
        post_id: 'some-post-id',
        users_id: 'some-user-id',
        comment: 'This is a test comment.',
      };

      // กำหนดค่าที่ mockCommentModel.create จะคืนกลับมา
      const createdComment = {
        ...createCommentDto,
        create_date: new Date(),
        toJSON: () => ({
          ...createCommentDto,
          create_date: new Date(),
        }),
      };
      mockCommentModel.create.mockResolvedValue(createdComment);

      const result = await service.create(createCommentDto);

      expect(commentModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          create_by: createCommentDto.users_id,
          post_id: createCommentDto.post_id,
          users_id: createCommentDto.users_id,
          comment: createCommentDto.comment,
          create_date: expect.any(Date), // ตรวจสอบว่าเป็น Date object
        }),
      );
      expect(result).toEqual({ success: true, code: 200 });
    });

    it('should return failure if comment creation fails', async () => {
      const createCommentDto = {
        post_id: 'some-post-id',
        users_id: 'some-user-id',
        comment: 'This is a test comment.',
      };

      mockCommentModel.create.mockResolvedValue(null); // จำลองว่าการสร้างล้มเหลว

      const result = await service.create(createCommentDto);

      expect(result).toEqual({ success: false, code: 404 });
    });
  });
});
