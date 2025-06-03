/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { Users } from '../../src/models/users.entity';

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersModel: typeof Users;

  const mockUsersModel = {
    findOrCreate: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(Users),
          useValue: mockUsersModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersModel = module.get<typeof Users>(getModelToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user if not found', async () => {
      const username = 'testuser';
      const user = { users_id: 1, username: 'testuser' };
      mockUsersModel.findOrCreate.mockResolvedValue([user, true]);

      const result = await service.create(username);

      expect(mockUsersModel.findOrCreate).toHaveBeenCalledWith({
        attributes: ['users_id', 'username'],
        where: { username: username },
        defaults: { username },
      });
      expect(result).toEqual({ success: true, code: 200, data: user });
    });

    it('should return existing user if found', async () => {
      const username = 'existinguser';
      const user = { users_id: 2, username: 'existinguser' };
      mockUsersModel.findOrCreate.mockResolvedValue([user, false]);

      const result = await service.create(username);

      expect(mockUsersModel.findOrCreate).toHaveBeenCalledWith({
        attributes: ['users_id', 'username'],
        where: { username: username },
        defaults: { username },
      });
      expect(result).toEqual({ success: true, code: 200, data: user });
    });

    it('should return null if an error occurs', async () => {
      const username = 'erroruser';
      mockUsersModel.findOrCreate.mockRejectedValue(
        new Error('Database error'),
      );
      jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log to prevent test output

      const result = await service.create(username);

      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(new Error('Database error'));
    });
  });

  describe('findOne', () => {
    it('should find and return a user by username', async () => {
      const username = 'finduser';
      const user = {
        users_id: 3,
        username: 'finduser',
        toJSON: () => ({ users_id: 3, username: 'finduser' }),
      };
      mockUsersModel.findOne.mockResolvedValue(user);

      const result = await service.findOne(username);

      expect(mockUsersModel.findOne).toHaveBeenCalledWith({
        attributes: ['users_id', 'username'],
        where: { username },
      });
      expect(result).toEqual({ users_id: 3, username: 'finduser' });
    });

    it('should return null if user is not found', async () => {
      const username = 'notfound';
      mockUsersModel.findOne.mockResolvedValue(null);

      const result = await service.findOne(username);

      expect(mockUsersModel.findOne).toHaveBeenCalledWith({
        attributes: ['users_id', 'username'],
        where: { username },
      });
      expect(result).toBeUndefined(); // findOne returns undefined if not found before the toJSON call
    });

    it('should return null if an error occurs', async () => {
      const username = 'errorfind';
      mockUsersModel.findOne.mockRejectedValue(new Error('Find error'));
      jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await service.findOne(username);

      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(new Error('Find error'));
    });
  });
});
