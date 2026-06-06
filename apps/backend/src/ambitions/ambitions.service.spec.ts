import { Test, TestingModule } from '@nestjs/testing';
import { AmbitionsService } from './ambitions.service';

jest.mock('src/db');

describe('AmbitionsService', () => {
  let service: AmbitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmbitionsService],
    }).compile();

    service = module.get<AmbitionsService>(AmbitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
