import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import type { User } from '@ambitiousyou/shared/types';
import { SessionGuard } from 'src/auth/guards/session.guard';

jest.mock('src/db');

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUsersService: jest.Mocked<Pick<UsersService, 'findUserBySessionToken'>>;

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
      findUserBySessionToken: jest.fn(),
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

  describe('findUserFromSessionToken', () => {
    it('should call usersService.findUserBySessionToken with the bearer token stripped', async () => {
      const user = buildUser({ id: '1', name: 'John Doe', email: 'john@example.com', emailVerified: true });

      mockUsersService.findUserBySessionToken.mockResolvedValue(user);

      const result = await usersController.findUserFromSessionToken('Bearer token-123');

      expect(mockUsersService.findUserBySessionToken).toHaveBeenCalledWith('token-123');
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findUserBySessionToken.mockResolvedValue(null);

      const result = await usersController.findUserFromSessionToken('Bearer non-existent-token');

      expect(mockUsersService.findUserBySessionToken).toHaveBeenCalledWith('non-existent-token');
      expect(result).toBeNull();
    });
  });
});
