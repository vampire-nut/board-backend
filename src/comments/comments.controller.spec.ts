/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService; // เพิ่มตัวแปรสำหรับ mock service

  // Mock implementation for the CommentsService
  const mockCommentsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService, // Provide the mock service
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService); // เข้าถึง mock service
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call commentsService.create and return its result', async () => {
      const createCommentDto: CreateCommentDto = {
        post_id: 'test-post-id',
        users_id: 'test-user-id',
        comment: 'This is a test comment from controller.',
      };
      const serviceResult = { success: true, code: 200 };

      // กำหนดค่าที่ mockCommentsService.create จะคืนกลับมา
      mockCommentsService.create.mockResolvedValue(serviceResult);

      const result = await controller.create(createCommentDto);

      // ตรวจสอบว่า service.create ถูกเรียกด้วย DTO ที่ถูกต้อง
      expect(service.create).toHaveBeenCalledWith(createCommentDto);
      // ตรวจสอบว่า controller คืนค่าที่มาจาก service
      expect(result).toEqual(serviceResult);
    });

    it('should handle errors from commentsService.create', async () => {
      const createCommentDto: CreateCommentDto = {
        post_id: 'test-post-id',
        users_id: 'test-user-id',
        comment: 'This is a test comment from controller.',
      };
      const errorResult = {
        success: false,
        code: 500,
        error: new Error('Service error'),
      };

      mockCommentsService.create.mockResolvedValue(errorResult);

      const result = await controller.create(createCommentDto);

      expect(service.create).toHaveBeenCalledWith(createCommentDto);
      expect(result).toEqual(errorResult);
    });
  });
});
