/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/unbound-method -- the auto-mocked Drizzle `db` and mocked bcrypt module are intentionally `any`-typed in tests. */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, HttpException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/notifications/email.service';
import { db } from 'src/db';
import { buildChain } from 'src/test-utils/db-chain';

jest.mock('src/db');
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: any;
  let mockEmailService: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockUsersService = {
      findOneByEmail: jest.fn(),
      findOneByEmailWithPassword: jest.fn(),
      findOneById: jest.fn(),
      createUser: jest.fn(),
      updatePassword: jest.fn(),
    };
    mockEmailService = {
      sendVerificationEmail: jest.fn(),
      sendWelcomeEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
      sendPasswordResetConfirmationEmail: jest.fn(),
      sendPasswordChangedEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: UsersService, useValue: mockUsersService }, { provide: EmailService, useValue: mockEmailService }],
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
    const registerUserDto = { name: 'John Doe', email: 'john@example.com', password: 'password123' };

    it('should successfully register a new user', async () => {
      const mockUser = { id: 'uuid-1', ...registerUserDto, emailVerified: false, image: null, createdAt: new Date(), updatedAt: new Date() };
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

      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(mockUser);
      (db.insert as jest.Mock).mockReturnValueOnce(buildChain([mockSession]));

      const result = await service.registerUser(registerUserDto);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerUserDto.email);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(registerUserDto);
      expect(db.insert).toHaveBeenCalled();
      expect(result).toEqual({ sessionToken: 'session-token' });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({ id: 'uuid-2', ...registerUserDto });

      await expect(service.registerUser(registerUserDto)).rejects.toThrow(ConflictException);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerUserDto.email);
    });

    it('should throw ConflictException with correct message if email exists', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({ id: 'uuid-2' });

      await expect(service.registerUser(registerUserDto)).rejects.toThrow('Email is already in use');
    });
  });

  describe('loginUser', () => {
    const loginUserDto = { email: 'john@example.com', password: 'password123', ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0' };

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
      (db.insert as jest.Mock).mockReturnValueOnce(buildChain([mockSession]));

      const result = await service.loginUser(loginUserDto);

      expect(mockUsersService.findOneByEmailWithPassword).toHaveBeenCalledWith(loginUserDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUserDto.password, mockUser.passwordHash);
      expect(db.insert).toHaveBeenCalled();
      expect(result).toEqual({ sessionToken: 'session-token' });
    });

    it('should throw ConflictException if user email not found', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(null);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow(ConflictException);
      expect(mockUsersService.findOneByEmailWithPassword).toHaveBeenCalledWith(loginUserDto.email);
    });

    it('should throw ConflictException if user email not found with correct message', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(null);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue({ id: 'uuid-1', email: loginUserDto.email, passwordHash: 'hashedPassword' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedException with correct message if password is invalid', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue({ id: 'uuid-1', email: loginUserDto.email, passwordHash: 'hashedPassword' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      try {
        await service.loginUser(loginUserDto);
        fail('Should have thrown UnauthorizedException');
      } catch (error: any) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid email or password');
      }
    });
  });

  describe('resendVerification', () => {
    const unverifiedUser = { id: 'uuid-1', name: 'John Doe', email: 'john@example.com', emailVerified: false };

    it('rejects with 429 while a valid verification token still exists', async () => {
      mockUsersService.findOneById.mockResolvedValue(unverifiedUser);
      (db.select as jest.Mock).mockReturnValueOnce(buildChain([{ id: 'v1', userId: 'uuid-1', identifier: 'email', value: 'token', expiresAt: new Date(Date.now() + 60_000) }]));

      await expect(service.resendVerification('uuid-1')).rejects.toThrow(HttpException);
      expect(db.insert).not.toHaveBeenCalled();
    });

    it('issues a new verification email when no valid token exists', async () => {
      mockUsersService.findOneById.mockResolvedValue(unverifiedUser);
      // db.select default chain resolves to [] — no outstanding token.

      const result = await service.resendVerification('uuid-1');

      expect(result).toEqual({ success: true });
      expect(db.insert).toHaveBeenCalled();
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it('throws BadRequestException when the email is already verified', async () => {
      mockUsersService.findOneById.mockResolvedValue({ ...unverifiedUser, emailVerified: true });

      await expect(service.resendVerification('uuid-1')).rejects.toThrow(BadRequestException);
      expect(db.insert).not.toHaveBeenCalled();
    });
  });
});
