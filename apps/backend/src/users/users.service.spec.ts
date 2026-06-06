/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/unbound-method -- the auto-mocked Drizzle `db` is intentionally `any`-typed in tests. */
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { SettingsService } from 'src/settings/settings.service';
import { db } from 'src/db';
import { buildChain } from 'src/test-utils/db-chain';

jest.mock('src/db');

describe('UsersService', () => {
  let userService: UsersService;
  let settingsService: { createSettingsForUserId: jest.Mock };

  beforeEach(async () => {
    jest.clearAllMocks();
    settingsService = { createSettingsForUserId: jest.fn() };

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: SettingsService, useValue: settingsService }],
    }).compile();

    userService = testingModule.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash the password, insert the user, and seed its settings', async () => {
      const createUserDto = { name: 'Hemant Sharma', email: 'hemant@hemantsharma.tech', password: 'password123' };

      const createdUser = {
        id: '1',
        name: createUserDto.name,
        email: createUserDto.email,
        emailVerified: false,
        image: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
      (db.insert as jest.Mock).mockReturnValueOnce(buildChain([createdUser]));
      settingsService.createSettingsForUserId.mockResolvedValue(undefined);

      const result = await userService.createUser(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(db.insert).toHaveBeenCalled();
      expect(settingsService.createSettingsForUserId).toHaveBeenCalledWith(createdUser.id);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should return the user with public columns only', async () => {
      const user = {
        id: '1',
        name: 'Hemant Sharma',
        email: 'hemant@hemantsharma.tech',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.select as jest.Mock).mockReturnValueOnce(buildChain([user]));

      const result = await userService.findOneByEmail('hemant@hemantsharma.tech');

      expect(db.select).toHaveBeenCalled();
      // public columns projection (no passwordHash) is passed as the first arg to db.select
      const selectArg = (db.select as jest.Mock).mock.calls[0][0];
      expect(selectArg).not.toHaveProperty('passwordHash');
      expect(result).toEqual(user);
    });

    it('should return null when no user matches', async () => {
      (db.select as jest.Mock).mockReturnValueOnce(buildChain([]));

      const result = await userService.findOneByEmail('missing@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findOneByEmailWithPassword', () => {
    it('should return the full user row including passwordHash', async () => {
      const user = {
        id: '1',
        name: 'Hemant Sharma',
        email: 'hemant@hemantsharma.tech',
        passwordHash: 'hashed-password',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.select as jest.Mock).mockReturnValueOnce(buildChain([user]));

      const result = await userService.findOneByEmailWithPassword('hemant@hemantsharma.tech');

      // login query calls db.select() with no projection arg => full row
      const selectArg = (db.select as jest.Mock).mock.calls[0][0];
      expect(selectArg).toBeUndefined();
      expect(result).toEqual(user);
    });
  });
});
