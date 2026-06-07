import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { eq, getTableColumns } from 'drizzle-orm';
import type { User } from '@ambitiousyou/shared/types';
import { CreateUserDto } from './dto/create-user.dto';
import { SettingsService } from 'src/settings/settings.service';
import { db, sessions, users } from 'src/db';

// Default-deny projection on every public user read — the destructure drops
// `passwordHash` from `getTableColumns(users)`. The single login escape hatch
// (`findOneByEmailWithPassword`) reads the full row instead.
const { passwordHash: _passwordHash, ...publicUserColumns } = getTableColumns(users);

// node-postgres surfaces a UNIQUE constraint violation as SQLSTATE 23505 on
// the thrown DatabaseError.
const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class UsersService {
  constructor(private readonly settingsService: SettingsService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    let user: User;
    try {
      const [created] = await db
        .insert(users)
        .values({
          name: createUserDto.name,
          email: createUserDto.email,
          emailVerified: false,
          passwordHash: hashedPassword,
          image: null,
        })
        .returning(publicUserColumns);
      user = created;
    } catch (e) {
      if (e !== null && typeof e === 'object' && 'code' in e && (e as { code?: string }).code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('Username already exists');
      }
      throw e;
    }

    await this.settingsService.createSettingsForUserId(user.id);

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const [user] = await db.select(publicUserColumns).from(users).where(eq(users.email, email)).limit(1);
    return user ?? null;
  }

  /** Login-only escape hatch — returns the full row including `passwordHash`. */
  async findOneByEmailWithPassword(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user ?? null;
  }

  async findOneById(id: string): Promise<User | null> {
    const [user] = await db.select(publicUserColumns).from(users).where(eq(users.id, id)).limit(1);
    return user ?? null;
  }

  async findUser(userId: string): Promise<User | null> {
    const [row] = await db.select(publicUserColumns).from(users).where(eq(users.id, userId)).limit(1);
    return row ?? null;
  }
}
