import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { SessionEntity } from './entities/session.entity';
import { VerificationEntity } from './entities/verification.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: any;
  let mockSessionRepository: any;
  let mockVerificationRepository: any;

  beforeEach(async () => {
    mockUsersService = {
      findOneByEmail: jest.fn(),
      findOneByEmailWithPassword: jest.fn(),
      create: jest.fn(),
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
          provide: UsersService,
          useValue: mockUsersService,
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
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const mockUser = {
        id: 'uuid-1',
        ...registerUserDto,
        passwordHash: 'hashedPassword',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSession = {
        id: 'session-uuid',
        userId: 'uuid-1',
        token: 'session-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: null,
        userAgent: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(mockUser);
      mockSessionRepository.create.mockReturnValue(mockSession);
      mockSessionRepository.save.mockResolvedValue(mockSession);

      const result = await service.registerUser(registerUserDto);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerUserDto.email);
      expect(mockUsersService.create).toHaveBeenCalledWith(registerUserDto);
      expect(mockSessionRepository.create).toHaveBeenCalled();
      expect(mockSessionRepository.save).toHaveBeenCalledWith(mockSession);
      expect(result).toEqual({
        sessionToken: 'session-token',
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        id: 'uuid-2',
        ...registerUserDto,
      };

      mockUsersService.findOneByEmail.mockResolvedValue(existingUser);

      await expect(service.registerUser(registerUserDto)).rejects.toThrow(ConflictException);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerUserDto.email);
    });

    it('should throw ConflictException with correct message if email exists', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({
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

      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockSessionRepository.create.mockReturnValue(mockSession);
      mockSessionRepository.save.mockResolvedValue(mockSession);

      const result = await service.loginUser(loginUserDto);

      expect(mockUsersService.findOneByEmailWithPassword).toHaveBeenCalledWith(loginUserDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUserDto.password, mockUser.passwordHash);
      expect(mockSessionRepository.create).toHaveBeenCalled();
      expect(mockSessionRepository.save).toHaveBeenCalledWith(mockSession);
      expect(result).toEqual({
        sessionToken: 'session-token',
      });
    });

    it('should throw ConflictException if user email not found', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(null);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow(ConflictException);
      expect(mockUsersService.findOneByEmailWithPassword).toHaveBeenCalledWith(loginUserDto.email);
    });

    it('should throw ConflictException if user email not found with correct message', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(null);

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

      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(mockUser);
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

      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(mockUser);
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
