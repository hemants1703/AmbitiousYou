import { Test, TestingModule } from '@nestjs/testing';
import { MilestonesService } from './milestones.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('MilestonesService', () => {
  let service: MilestonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MilestonesService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<MilestonesService>(MilestonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
