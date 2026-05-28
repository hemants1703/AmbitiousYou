import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
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

      return await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error in createUser: ', error);

      if (error instanceof QueryFailedError) {
        const DUPLICATE_USERNAME = '23505';
        const e: { code: string } = error.driverError as { code: string };

        if (e.code === DUPLICATE_USERNAME) {
          throw new ConflictException('Username already exists');
        }
      }

      throw new HttpException('Server Error', 500);
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    try {
      return await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error in findOneByEmail: ', error);
      throw new HttpException('Server Error', 500);
    }
  }

  async findOneByEmailWithPassword(email: string): Promise<UserEntity | null> {
    try {
      return await this.usersRepository.createQueryBuilder('user').addSelect('user.passwordHash').where('user.email = :email', { email }).getOne();
    } catch (error) {
      console.error('Error in findOneByEmailWithPassword: ', error);
      throw new HttpException('Server Error', 500);
    }
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    try {
      return await this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error in findOneById: ', error);
      throw new HttpException('Server Error', 500);
    }
  }
}
