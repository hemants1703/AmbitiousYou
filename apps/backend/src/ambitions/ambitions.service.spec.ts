import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AmbitionsService } from './ambitions.service';
import { db } from '../db';
import { buildChain } from '../test-utils/db-chain';
import type { UpdateAmbitionDto } from './dto/update-ambition.dto';

jest.mock('src/db');

const baseAmbition = {
  id: 'ambition-1',
  userId: 'user-1',
  ambitionName: 'Ship the app',
  ambitionDefinition: '',
  ambitionMotivation: '',
  ambitionStartDate: new Date('2026-01-01T00:00:00'),
  ambitionEndDate: new Date('2026-06-30T00:00:00'),
  ambitionEndDateHistory: [] as { previousEndDate: string; newEndDate: string; changedAt: string }[],
  ambitionPriority: 'medium' as const,
  ambitionStatus: 'active' as const,
  ambitionPercentageCompleted: 0,
  ambitionCompletionDate: null,
  isFavourited: false,
  createdAt: new Date('2026-01-01T00:00:00'),
  updatedAt: new Date('2026-01-01T00:00:00'),
};

function updateDto(overrides: Partial<UpdateAmbitionDto> = {}): UpdateAmbitionDto {
  return {
    ambitionName: 'Ship the app',
    ambitionDefinition: '',
    ambitionMotivation: '',
    ambitionStartDate: new Date('2026-01-01T00:00:00'),
    ambitionEndDate: new Date('2026-06-30T00:00:00'),
    ambitionPriority: 'medium',
    isFavourited: false,
    ...overrides,
  } as UpdateAmbitionDto;
}

describe('AmbitionsService.updateAmbitionById', () => {
  let service: AmbitionsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AmbitionsService],
    }).compile();

    service = module.get<AmbitionsService>(AmbitionsService);
  });

  it('rejects an end date earlier than the current end date', async () => {
    (db.select as jest.Mock).mockReturnValueOnce(buildChain([baseAmbition]));

    await expect(
      service.updateAmbitionById('user-1', 'ambition-1', updateDto({ ambitionEndDate: new Date('2026-06-01T00:00:00') })),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(db.update).not.toHaveBeenCalled();
  });

  it('appends a history entry when the end date moves later', async () => {
    const laterEnd = new Date('2026-08-01T00:00:00');
    const updated = { ...baseAmbition, ambitionEndDate: laterEnd };

    (db.select as jest.Mock).mockReturnValueOnce(buildChain([baseAmbition]));
    (db.update as jest.Mock).mockReturnValueOnce(buildChain([updated]));

    await service.updateAmbitionById('user-1', 'ambition-1', updateDto({ ambitionEndDate: laterEnd }));

    const setArg = (db.update as jest.Mock).mock.results[0].value.set.mock.calls[0][0] as {
      ambitionEndDate: Date;
      ambitionEndDateHistory: { previousEndDate: string; newEndDate: string; changedAt: string }[];
    };
    expect(setArg.ambitionEndDate).toEqual(laterEnd);
    expect(setArg.ambitionEndDateHistory).toHaveLength(1);
    expect(setArg.ambitionEndDateHistory[0].previousEndDate).toBe(baseAmbition.ambitionEndDate.toISOString());
    expect(setArg.ambitionEndDateHistory[0].newEndDate).toBe(laterEnd.toISOString());
    expect(setArg.ambitionEndDateHistory[0].changedAt).toEqual(expect.any(String));
  });

  it('does not append history when the end date is unchanged', async () => {
    const updated = { ...baseAmbition, ambitionName: 'Renamed' };

    (db.select as jest.Mock).mockReturnValueOnce(buildChain([baseAmbition]));
    (db.update as jest.Mock).mockReturnValueOnce(buildChain([updated]));

    await service.updateAmbitionById('user-1', 'ambition-1', updateDto({ ambitionName: 'Renamed' }));

    const setArg = (db.update as jest.Mock).mock.results[0].value.set.mock.calls[0][0] as {
      ambitionEndDateHistory: unknown[];
    };
    expect(setArg.ambitionEndDateHistory).toEqual([]);
  });

  it('persists a later end date and keeps completed status', async () => {
    const completed = { ...baseAmbition, ambitionStatus: 'completed' as const };
    const laterEnd = new Date('2026-08-01T00:00:00');
    const updated = { ...completed, ambitionEndDate: laterEnd };

    (db.select as jest.Mock).mockReturnValueOnce(buildChain([completed]));
    (db.update as jest.Mock).mockReturnValueOnce(buildChain([updated]));

    const result = await service.updateAmbitionById('user-1', 'ambition-1', updateDto({ ambitionEndDate: laterEnd }));

    expect(result).toEqual(updated);
    const setArg = (db.update as jest.Mock).mock.results[0].value.set.mock.calls[0][0] as {
      ambitionEndDate: Date;
      ambitionStatus: string;
    };
    expect(setArg.ambitionEndDate).toEqual(laterEnd);
    expect(setArg.ambitionStatus).toBe('completed');
  });

  it('reactivates a missed ambition when the end date moves into the future', async () => {
    const missed = {
      ...baseAmbition,
      ambitionStatus: 'missed' as const,
      ambitionEndDate: new Date('2020-01-01T00:00:00'),
    };
    const laterEnd = new Date('2099-12-31T00:00:00');
    const updated = { ...missed, ambitionEndDate: laterEnd, ambitionStatus: 'active' as const };

    (db.select as jest.Mock).mockReturnValueOnce(buildChain([missed]));
    (db.update as jest.Mock).mockReturnValueOnce(buildChain([updated]));

    await service.updateAmbitionById('user-1', 'ambition-1', updateDto({ ambitionEndDate: laterEnd }));

    const setArg = (db.update as jest.Mock).mock.results[0].value.set.mock.calls[0][0] as {
      ambitionStatus: string;
    };
    expect(setArg.ambitionStatus).toBe('active');
  });
});
