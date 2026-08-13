import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { db } from '../db';
import { buildChain } from '../test-utils/db-chain';
import { TasksService } from './tasks.service';

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
  task: 'Ship it',
  taskDescription: '',
  taskCompleted: false,
  taskDeadline: new Date('2099-06-01T00:00:00.000Z'),
};

describe('TasksService.createTask', () => {
  let service: TasksService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('creates a task when the ambition window is open', async () => {
    const saved = { id: 'task-1', userId: 'user-1', ...createDto };

    (db.select as jest.Mock).mockReturnValueOnce(buildChain([activeAmbition]));
    (db.insert as jest.Mock).mockReturnValueOnce(buildChain([saved]));

    await expect(service.createTask('user-1', createDto as never)).resolves.toEqual(saved);
    expect(db.insert).toHaveBeenCalled();
  });

  it('rejects create when the ambition is missed', async () => {
    (db.select as jest.Mock).mockReturnValueOnce(buildChain([{ ...activeAmbition, ambitionStatus: 'missed' as const, ambitionEndDate: new Date('2020-01-01T00:00:00.000Z') }]));

    await expect(service.createTask('user-1', createDto as never)).rejects.toBeInstanceOf(BadRequestException);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it('marks overdue active ambitions missed and rejects create', async () => {
    (db.select as jest.Mock).mockReturnValueOnce(buildChain([{ ...activeAmbition, ambitionEndDate: new Date('2020-01-01T00:00:00.000Z') }]));
    (db.update as jest.Mock).mockReturnValueOnce(buildChain([{ id: 'ambition-1', ambitionStatus: 'missed' }]));

    await expect(service.createTask('user-1', createDto as never)).rejects.toBeInstanceOf(BadRequestException);
    expect(db.update).toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();
  });
});
