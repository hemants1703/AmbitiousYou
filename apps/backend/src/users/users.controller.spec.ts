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

  describe('findUserFromSessionToken', () => {
    it('should call usersService.findUserBySessionToken with correct token', async () => {
      const sessionToken = '1';
      const user = buildUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: true,
      });

      mockUsersService.findOneById.mockResolvedValue(user);

      const result = await usersController.findUserFromSessionToken(sessionToken);

      expect(mockUsersService.findOneById).toHaveBeenCalledWith(sessionToken);
      expect(result).toEqual(user);
    });
  });
});
