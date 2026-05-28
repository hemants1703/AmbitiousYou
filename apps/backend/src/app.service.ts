import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getBackendStatus(): string {
    return 'Backend is running!';
  }
}
