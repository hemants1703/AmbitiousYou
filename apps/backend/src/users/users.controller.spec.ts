import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import type { User } from '@ambitiousyou/shared/types';
import { SessionGuard } from 'src/auth/guards/session.guard';

jest.mock('src/db');

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUsersService: jest.Mocked<Pick<UsersService, 'findUser' | 'updateUser'>>;

  const buildUser = (overrides: Partial<User> = {}): User => ({
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    mockUsersService = {
      findUser: jest.fn(),
      updateUser: jest.fn(),
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

  describe('findUser', () => {
    it('should call usersService.findUser with the user id', async () => {
      const user = buildUser({ id: '1', name: 'John Doe', email: 'john@example.com', emailVerified: true });

      mockUsersService.findUser.mockResolvedValue(user);

      const result = await usersController.findUser('123');

      expect(mockUsersService.findUser).toHaveBeenCalledWith('123');
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findUser.mockResolvedValue(null);

      const result = await usersController.findUser('non-existent-id');

      expect(mockUsersService.findUser).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should call usersService.updateUser with the user id and dto', async () => {
      const user = buildUser({ image: 'icon:panda:rose' });
      mockUsersService.updateUser.mockResolvedValue(user);

      const result = await usersController.updateUser('123', { image: 'icon:panda:rose' });

      expect(mockUsersService.updateUser).toHaveBeenCalledWith('123', { image: 'icon:panda:rose' });
      expect(result).toEqual(user);
    });
  });
});
