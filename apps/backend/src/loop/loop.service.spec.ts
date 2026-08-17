import { Test, TestingModule } from '@nestjs/testing';
import { LoopService } from './loop.service';
import { db } from 'src/db';
import { buildChain } from 'src/test-utils/db-chain';

jest.mock('src/db');

describe('LoopService', () => {
  let service: LoopService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoopService],
    }).compile();
    service = module.get(LoopService);
  });

  it('returns null contract with suggested move when none exists for today', async () => {
    const primary = {
      id: 'amb-1',
      userId: 'user-1',
      ambitionName: 'Spring Boot',
      isFavourited: true,
      ambitionStatus: 'active',
    };
    const milestone = {
      id: 'ms-1',
      milestone: 'Ship auth module',
      milestoneDescription: null,
      milestoneTargetDate: new Date('2026-08-20'),
    };

    (db.select as jest.Mock)
      .mockReturnValueOnce(buildChain([{ userTimezone: 'UTC' }]))
      .mockReturnValueOnce(buildChain([]))
      .mockReturnValueOnce(buildChain([primary]))
      .mockReturnValueOnce(buildChain([milestone]));

    const result = await service.getContract('user-1', '2026-08-14');

    expect(result.contract).toBeNull();
    expect(result.suggestedMove).toEqual({
      kind: 'milestone',
      id: 'ms-1',
      title: 'Ship auth module',
      description: null,
      date: milestone.milestoneTargetDate,
    });
  });
});
