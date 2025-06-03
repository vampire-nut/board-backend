/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create and return the result', async () => {
      const createUsersDto: CreateUsersDto = {
        username: 'testuser',
        users_id: '',
      };
      const serviceResult = {
        success: true,
        code: 200,
        data: { users_id: 1, username: 'testuser' },
      };

      mockUsersService.create.mockResolvedValue(serviceResult);

      const result = await controller.create(createUsersDto);

      expect(service.create).toHaveBeenCalledWith(createUsersDto.username);
      expect(result).toEqual(serviceResult);
    });

    it('should handle cases where service.create returns null (e.g., error)', async () => {
      const createUsersDto: CreateUsersDto = {
        username: 'erroruser',
        users_id: '',
      };

      mockUsersService.create.mockResolvedValue(null);

      const result = await controller.create(createUsersDto);

      expect(service.create).toHaveBeenCalledWith(createUsersDto.username);
      expect(result).toBeNull();
    });
  });
});
