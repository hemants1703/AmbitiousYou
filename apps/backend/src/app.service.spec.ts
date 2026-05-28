import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = testingModule.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('should return backend status', () => {
    expect(appService.getBackendStatus()).toBe('Backend is running!');
  });
});
