import { Test, TestingModule } from '@nestjs/testing';
import { AmbitionsService } from './ambitions.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AmbitionsService', () => {
  let service: AmbitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmbitionsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<AmbitionsService>(AmbitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
