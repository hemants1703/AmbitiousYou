import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { SessionEntity } from './entities/session.entity';
import { VerificationEntity } from './entities/verification.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockSessionRepository: any;
  let mockVerificationRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockSessionRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    mockVerificationRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(SessionEntity),
          useValue: mockSessionRepository,
        },
        {
          provide: getRepositoryToken(VerificationEntity),
          useValue: mockVerificationRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    const registerUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should successfully register a new user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const mockUser = {
        id: 'uuid-1',
        ...registerUserDto,
        passwordHash: 'hashedPassword',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockVerification = {
        id: 'verification-uuid',
        userId: 'uuid-1',
        identifier: 'email',
        value: 'verification-token',
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockVerificationRepository.create.mockReturnValue(mockVerification);
      mockVerificationRepository.save.mockResolvedValue(mockVerification);

      const result = await service.registerUser(registerUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerUserDto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockVerificationRepository.create).toHaveBeenCalled();
      expect(mockVerificationRepository.save).toHaveBeenCalledWith(mockVerification);
      expect(result).toEqual({
        userId: 'uuid-1',
        message: 'Check email for verification link',
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        id: 'uuid-2',
        ...registerUserDto,
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.registerUser(registerUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerUserDto.email },
      });
    });

    it('should throw ConflictException with correct message if email exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 'uuid-2',
      });

      try {
        await service.registerUser(registerUserDto);
        fail('Should have thrown ConflictException');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Email is already in use');
      }
    });
  });

  describe('loginUser', () => {
    const loginUserDto = {
      email: 'john@example.com',
      password: 'password123',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
    };

    it('should successfully login a user', async () => {
      const mockUser = {
        id: 'uuid-1',
        name: 'John Doe',
        email: loginUserDto.email,
        passwordHash: 'hashedPassword',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSession = {
        id: 'session-uuid',
        userId: 'uuid-1',
        token: 'session-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: loginUserDto.ipAddress,
        userAgent: loginUserDto.userAgent,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockSessionRepository.create.mockReturnValue(mockSession);
      mockSessionRepository.save.mockResolvedValue(mockSession);

      const result = await service.loginUser(loginUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUserDto.password, mockUser.passwordHash);
      expect(mockSessionRepository.create).toHaveBeenCalled();
      expect(mockSessionRepository.save).toHaveBeenCalledWith(mockSession);
      expect(result).toEqual({
        token: 'session-token',
        user: mockUser,
      });
    });

    it('should throw ConflictException if user email not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
    });

    it('should throw ConflictException if user email not found with correct message', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      try {
        await service.loginUser(loginUserDto);
        fail('Should have thrown ConflictException');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Invalid email or password');
      }
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: 'uuid-1',
        email: loginUserDto.email,
        passwordHash: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUserDto.password, mockUser.passwordHash);
    });

    it('should throw UnauthorizedException with correct message if password is invalid', async () => {
      const mockUser = {
        id: 'uuid-1',
        email: loginUserDto.email,
        passwordHash: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      try {
        await service.loginUser(loginUserDto);
        fail('Should have thrown UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid email or password');
      }
    });
  });
});
