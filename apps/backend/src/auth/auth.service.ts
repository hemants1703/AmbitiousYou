import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  registerUser(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  loginUser(createAuthDto: CreateAuthDto) {
    return 'This action logs in a user';
  }
}
