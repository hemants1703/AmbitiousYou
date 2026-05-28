import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly entityManager: EntityManager) {}

  create(createUserDto: CreateUserDto) {
    return this.entityManager.save(createUserDto);
  }

  findAll() {
    return this.entityManager.find(UserEntity);
  }

  findOne(id: string) {
    return this.entityManager.findOne(UserEntity, { where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.entityManager.update(UserEntity, id, updateUserDto);
  }

  remove(id: string) {
    return this.entityManager.delete(UserEntity, id);
  }
}
