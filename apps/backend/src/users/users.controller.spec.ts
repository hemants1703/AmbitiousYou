import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import type { UserEntity } from './entities/user.entity';
import { SessionGuard } from 'src/auth/guards/session.guard';

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUsersService: jest.Mocked<Pick<UsersService, 'findOneById'>>;

  const buildUser = (overrides: Partial<UserEntity> = {}): UserEntity => ({
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: false,
    passwordHash: 'hashed-password',
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    mockUsersService = {
      findOneById: jest.fn(),
    };

    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(SessionGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    usersController = testingModule.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findOneById', () => {
    it('should call usersService.findOneById with correct id', async () => {
      const userId = '1';
      const user = buildUser({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: true,
      });

      mockUsersService.findOneById.mockResolvedValue(user);

      const result = await usersController.findOneById(userId);

      expect(mockUsersService.findOneById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it('should return a single user by id', async () => {
      const userId = '2';
      const user = buildUser({
        id: userId,
        name: 'Jane Doe',
        email: 'jane@example.com',
        emailVerified: false,
      });

      mockUsersService.findOneById.mockResolvedValue(user);

      const result = await usersController.findOneById(userId);

      expect(result).toEqual(user);
      if (!result) {
        throw new Error('Expected user to be defined');
      }
      expect(result.id).toBe(userId);
      expect(result.name).toBe('Jane Doe');
    });

    it('should return null if user not found', async () => {
      const userId = '999';
      mockUsersService.findOneById.mockResolvedValue(null);

      const result = await usersController.findOneById(userId);

      expect(result).toBeNull();
    });

    it('should handle errors from usersService', async () => {
      const userId = '1';
      const error = new Error('Database error');
      mockUsersService.findOneById.mockRejectedValue(error);

      await expect(usersController.findOneById(userId)).rejects.toThrow('Database error');
    });
  });
});
