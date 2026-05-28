import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

describe('UsersService', () => {
  let userService: UsersService;
  let usersRepository: jest.Mocked<Repository<UserEntity>>;
  let mockQueryBuilder: {
    addSelect: jest.Mock;
    where: jest.Mock;
    getOne: jest.Mock;
  };

  beforeEach(async () => {
    mockQueryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    usersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    } as unknown as jest.Mocked<Repository<UserEntity>>;

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: usersRepository,
        },
      ],
    }).compile();

    userService = testingModule.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { name: 'Hemant Sharma', email: 'hemant@hemantsharma.tech', password: 'password123' };

      const createdUser = {
        id: '1',
        name: createUserDto.name,
        email: createUserDto.email,
        emailVerified: false,
        passwordHash: 'hashed-password',
        image: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      } as UserEntity;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
      usersRepository.create.mockReturnValue(createdUser);
      usersRepository.save.mockResolvedValue(createdUser);

      const result = await userService.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(usersRepository.create).toHaveBeenCalledWith({
        id: expect.any(String),
        name: createUserDto.name,
        email: createUserDto.email,
        emailVerified: false,
        passwordHash: 'hashed-password',
        image: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(usersRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', name: 'Hemant Sharma', email: 'hemant@hemantsharma.tech' };

      usersRepository.findOne.mockResolvedValue(user as UserEntity);

      const result = await userService.findOneByEmail('hemant@hemantsharma.tech');

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: 'hemant@hemantsharma.tech' } });
      expect(result).toEqual(user);
    });
  });

  describe('findOneByEmailWithPassword', () => {
    it('should return a user by email including passwordHash', async () => {
      const user = {
        id: '1',
        name: 'Hemant Sharma',
        email: 'hemant@hemantsharma.tech',
        passwordHash: 'hashed-password',
      } as UserEntity;

      mockQueryBuilder.getOne.mockResolvedValue(user);

      const result = await userService.findOneByEmailWithPassword('hemant@hemantsharma.tech');

      expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.passwordHash');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: 'hemant@hemantsharma.tech',
      });
      expect(result).toEqual(user);
    });
  });
});
