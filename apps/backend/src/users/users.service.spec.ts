import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { EntityManager } from 'typeorm';
import { UserEntity } from './entities/user.entity';

describe('UsersService', () => {
  let userService: UsersService;
  let mockEntityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    mockEntityManager = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    userService = testingModule.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { name: 'Hemant Sharma', email: 'hemant@hemantsharma.tech', password: 'password123' };
      const createdUser = { id: '1', ...createUserDto };

      mockEntityManager.save.mockResolvedValue(createdUser);

      const result = await userService.create(createUserDto);

      expect((mockEntityManager.save as jest.Mock).mock.calls[0]).toEqual([createUserDto]);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: '1', name: 'Hemant Sharma', email: 'hemant@hemantsharma.tech' },
        { id: '2', name: 'John Doe', email: 'john@doe.com' },
      ];

      mockEntityManager.find.mockResolvedValue(users);

      const result = await userService.findAll();

      expect((mockEntityManager.find as jest.Mock).mock.calls[0]).toEqual([UserEntity]);
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', name: 'Hemant Sharma', email: 'hemant@hemantsharma.tech' };

      mockEntityManager.findOne.mockResolvedValue(user);

      const result = await userService.findOne('1');

      expect((mockEntityManager.findOne as jest.Mock).mock.calls[0]).toEqual([UserEntity, { where: { id: '1' } }]);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const updatedUserDto = { name: 'Hemant Sharma Updated', email: 'hemant@hemantsharma.tech' };

      mockEntityManager.update.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      const result = await userService.update('1', updatedUserDto);

      expect((mockEntityManager.update as jest.Mock).mock.calls[0]).toEqual([UserEntity, '1', updatedUserDto]);
      expect(result).toEqual({ affected: 1, raw: {}, generatedMaps: [] });
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      mockEntityManager.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await userService.remove('1');

      expect((mockEntityManager.delete as jest.Mock).mock.calls[0]).toEqual([UserEntity, '1']);
      expect(result).toEqual({ affected: 1, raw: {} });
    });
  });
});
