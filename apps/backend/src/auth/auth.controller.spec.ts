import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      registerUser: jest.fn(),
      loginUser: jest.fn(),
    };

    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = testingModule.get<AuthController>(AuthController);
    authService = testingModule.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('registerUser', () => {
    const registerUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should call authService.registerUser with correct parameters', async () => {
      const expectedResult = {
        userId: 'uuid-1',
        message: 'Check email for verification link',
      };

      mockAuthService.registerUser.mockResolvedValue(expectedResult);

      const result = await authController.registerUser(registerUserDto);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual(expectedResult);
    });

    it('should return the result from authService.registerUser', async () => {
      const expectedResult = {
        userId: 'uuid-1',
        message: 'Check email for verification link',
      };

      mockAuthService.registerUser.mockResolvedValue(expectedResult);

      const result = await authController.registerUser(registerUserDto);

      expect(result).toEqual(expectedResult);
    });

    it('should propagate ConflictException from authService', async () => {
      mockAuthService.registerUser.mockRejectedValue(new ConflictException('Email is already in use'));

      await expect(authController.registerUser(registerUserDto)).rejects.toThrow(ConflictException);
    });

    it('should handle errors from authService', async () => {
      const error = new Error('Database error');
      mockAuthService.registerUser.mockRejectedValue(error);

      await expect(authController.registerUser(registerUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('loginUser', () => {
    const loginUserDto = {
      email: 'john@example.com',
      password: 'password123',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
    };

    it('should call authService.loginUser with correct parameters', async () => {
      const expectedResult = {
        sessionToken: 'session-token-123',
      };

      mockAuthService.loginUser.mockResolvedValue(expectedResult);

      const result = await authController.loginUser(loginUserDto);

      expect(mockAuthService.loginUser).toHaveBeenCalledWith(loginUserDto);
      expect(result).toEqual(expectedResult);
    });

    it('should return sessionToken from authService.loginUser', async () => {
      const expectedResult = {
        sessionToken: 'session-token-123',
      };

      mockAuthService.loginUser.mockResolvedValue(expectedResult);

      const result = await authController.loginUser(loginUserDto);

      expect(result).toEqual(expectedResult);
      expect(result.sessionToken).toBe('session-token-123');
    });

    it('should propagate UnauthorizedException from authService', async () => {
      mockAuthService.loginUser.mockRejectedValue(new UnauthorizedException('Invalid email or password'));

      await expect(authController.loginUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should propagate ConflictException from authService', async () => {
      mockAuthService.loginUser.mockRejectedValue(new ConflictException('Invalid email or password'));

      await expect(authController.loginUser(loginUserDto)).rejects.toThrow(ConflictException);
    });

    it('should handle errors from authService', async () => {
      const error = new Error('Database error');
      mockAuthService.loginUser.mockRejectedValue(error);

      await expect(authController.loginUser(loginUserDto)).rejects.toThrow('Database error');
    });
  });
});
