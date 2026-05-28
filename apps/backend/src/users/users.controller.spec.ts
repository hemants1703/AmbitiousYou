import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SessionGuard } from 'src/auth/guards/session.guard';

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUsersService: any;

  beforeEach(async () => {
    mockUsersService = {
      create: jest.fn(),
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

  describe('create', () => {
    it('should call usersService.create with correct parameters', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const createdUser = {
        id: '1',
        ...createUserDto,
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await usersController.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should return the created user from usersService', async () => {
      const createUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
      };

      const createdUser = {
        id: '2',
        ...createUserDto,
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await usersController.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(result.id).toBe('2');
      expect(result.email).toBe('jane@example.com');
    });

    it('should handle errors from usersService', async () => {
      const createUserDto = {
        name: 'Error User',
        email: 'error@example.com',
        password: 'password789',
      };

      const error = new Error('Database error');
      mockUsersService.create.mockRejectedValue(error);

      await expect(usersController.create(createUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('findOneById', () => {
    it('should call usersService.findOneById with correct id', async () => {
      const userId = '1';
      const user = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: true,
      };

      mockUsersService.findOneById.mockResolvedValue(user);

      const result = await usersController.findOneById(userId);

      expect(mockUsersService.findOneById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it('should return a single user by id', async () => {
      const userId = '2';
      const user = {
        id: userId,
        name: 'Jane Doe',
        email: 'jane@example.com',
        emailVerified: false,
      };

      mockUsersService.findOneById.mockResolvedValue(user);

      const result = await usersController.findOneById(userId);

      expect(result).toEqual(user);
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
