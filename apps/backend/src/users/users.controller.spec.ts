import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let mockUsersService: any;

  beforeEach(async () => {
    mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = testingModule.get<UsersController>(UsersController);
    usersService = testingModule.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('findAll', () => {
    it('should call usersService.findAll', async () => {
      const users = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          emailVerified: true,
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          emailVerified: false,
        },
      ];

      mockUsersService.findAll.mockResolvedValue(users);

      const result = await usersController.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return an array of users', async () => {
      const users = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
        },
      ];

      mockUsersService.findAll.mockResolvedValue(users);

      const result = await usersController.findAll();

      expect(result).toEqual(users);
      expect(result.length).toBe(2);
    });

    it('should return an empty array if no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await usersController.findAll();

      expect(result).toEqual([]);
    });

    it('should handle errors from usersService', async () => {
      const error = new Error('Database error');
      mockUsersService.findAll.mockRejectedValue(error);

      await expect(usersController.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne with correct id', async () => {
      const userId = '1';
      const user = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: true,
      };

      mockUsersService.findOne.mockResolvedValue(user);

      const result = await usersController.findOne(userId);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
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

      mockUsersService.findOne.mockResolvedValue(user);

      const result = await usersController.findOne(userId);

      expect(result).toEqual(user);
      expect(result.id).toBe(userId);
      expect(result.name).toBe('Jane Doe');
    });

    it('should return null if user not found', async () => {
      const userId = '999';
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await usersController.findOne(userId);

      expect(result).toBeNull();
    });

    it('should handle errors from usersService', async () => {
      const userId = '1';
      const error = new Error('Database error');
      mockUsersService.findOne.mockRejectedValue(error);

      await expect(usersController.findOne(userId)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should call usersService.update with correct parameters', async () => {
      const userId = '1';
      const updateUserDto = {
        name: 'John Doe Updated',
        email: 'john.updated@example.com',
      };

      const result = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };

      mockUsersService.update.mockResolvedValue(result);

      const response = await usersController.update(userId, updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(response).toEqual(result);
    });

    it('should return update result from usersService', async () => {
      const userId = '2';
      const updateUserDto = {
        name: 'Jane Doe Updated',
      };

      const result = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };

      mockUsersService.update.mockResolvedValue(result);

      const response = await usersController.update(userId, updateUserDto);

      expect(response).toEqual(result);
      expect(response.affected).toBe(1);
    });

    it('should handle partial updates', async () => {
      const userId = '1';
      const updateUserDto = {
        name: 'Only Name Updated',
      };

      const result = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };

      mockUsersService.update.mockResolvedValue(result);

      const response = await usersController.update(userId, updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(response).toEqual(result);
    });

    it('should return affected count as 0 if user not found', async () => {
      const userId = '999';
      const updateUserDto = {
        name: 'Updated',
      };

      const result = {
        affected: 0,
        raw: {},
        generatedMaps: [],
      };

      mockUsersService.update.mockResolvedValue(result);

      const response = await usersController.update(userId, updateUserDto);

      expect(response.affected).toBe(0);
    });

    it('should handle errors from usersService', async () => {
      const userId = '1';
      const updateUserDto = { name: 'Updated' };
      const error = new Error('Database error');
      mockUsersService.update.mockRejectedValue(error);

      await expect(usersController.update(userId, updateUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with correct id', async () => {
      const userId = '1';
      const result = {
        affected: 1,
        raw: {},
      };

      mockUsersService.remove.mockResolvedValue(result);

      const response = await usersController.remove(userId);

      expect(mockUsersService.remove).toHaveBeenCalledWith(userId);
      expect(response).toEqual(result);
    });

    it('should return delete result from usersService', async () => {
      const userId = '2';
      const result = {
        affected: 1,
        raw: {},
      };

      mockUsersService.remove.mockResolvedValue(result);

      const response = await usersController.remove(userId);

      expect(response).toEqual(result);
      expect(response.affected).toBe(1);
    });

    it('should return affected count as 0 if user not found', async () => {
      const userId = '999';
      const result = {
        affected: 0,
        raw: {},
      };

      mockUsersService.remove.mockResolvedValue(result);

      const response = await usersController.remove(userId);

      expect(response.affected).toBe(0);
    });

    it('should handle errors from usersService', async () => {
      const userId = '1';
      const error = new Error('Database error');
      mockUsersService.remove.mockRejectedValue(error);

      await expect(usersController.remove(userId)).rejects.toThrow('Database error');
    });
  });
});
