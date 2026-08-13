import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { db } from '../db';
import { buildChain } from '../test-utils/db-chain';
import { MilestonesService } from './milestones.service';

jest.mock('src/db');
jest.mock('../ambitions/ambition-progress.util', () => ({
  recalculateAmbitionProgress: jest.fn().mockResolvedValue(undefined),
}));

const activeAmbition = {
  id: 'ambition-1',
  ambitionStatus: 'active' as const,
  ambitionEndDate: new Date('2099-12-31T00:00:00.000Z'),
};

const createDto = {
  ambitionId: 'ambition-1',
  milestone: 'Launch',
  milestoneDescription: '',
  milestoneCompleted: false,
  milestoneTargetDate: new Date('2099-06-01T00:00:00.000Z'),
};

describe('MilestonesService.createMilestone', () => {
  let service: MilestonesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MilestonesService],
    }).compile();

    service = module.get<MilestonesService>(MilestonesService);
  });

  it('creates a milestone when the ambition window is open', async () => {
    const saved = { id: 'milestone-1', userId: 'user-1', ...createDto };

    (db.select as jest.Mock).mockReturnValueOnce(buildChain([activeAmbition]));
    (db.insert as jest.Mock).mockReturnValueOnce(buildChain([saved]));

    await expect(service.createMilestone('user-1', createDto as never)).resolves.toEqual(saved);
    expect(db.insert).toHaveBeenCalled();
  });

  it('rejects create when the ambition is missed', async () => {
    (db.select as jest.Mock).mockReturnValueOnce(buildChain([{ ...activeAmbition, ambitionStatus: 'missed' as const, ambitionEndDate: new Date('2020-01-01T00:00:00.000Z') }]));

    await expect(service.createMilestone('user-1', createDto as never)).rejects.toBeInstanceOf(BadRequestException);
    expect(db.insert).not.toHaveBeenCalled();
  });
});
