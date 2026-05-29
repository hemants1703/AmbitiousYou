import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      id: crypto.randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
      emailVerified: false,
      passwordHash: hashedPassword,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await this.usersRepository.save(user);

    if (savedUser instanceof QueryFailedError) {
      const DUPLICATE_USERNAME = '23505';
      const e: { code: string } = savedUser.driverError as { code: string };

      if (e.code === DUPLICATE_USERNAME) {
        throw new ConflictException('Username already exists');
      }
    }

    return savedUser;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findOneByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return await this.usersRepository.createQueryBuilder('user').addSelect('user.passwordHash').where('user.email = :email', { email }).getOne();
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findUserBySessionToken(token: string): Promise<UserEntity | null> {
    return await this.usersRepository.createQueryBuilder('user').innerJoin('sessions', 'session', 'session.user_id = user.id').where('session.token = :token', { token }).getOne();
  }
}
