jest.mock('src/db');

import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { LoopController } from './loop.controller';
import { LoopService } from './loop.service';
import { ProGuard } from '../auth/guards/pro.guard';

describe('LoopController', () => {
  let controller: LoopController;
  let loopService: jest.Mocked<Pick<LoopService, 'getContract' | 'upsertContract' | 'completeContract' | 'snoozeContract' | 'getPrimary'>>;

  beforeEach(async () => {
    loopService = {
      getContract: jest.fn(),
      upsertContract: jest.fn(),
      completeContract: jest.fn(),
      snoozeContract: jest.fn(),
      getPrimary: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoopController],
      providers: [
        { provide: LoopService, useValue: loopService },
        {
          provide: ProGuard,
          useValue: {
            canActivate: jest.fn().mockRejectedValue(new ForbiddenException('Pro access required')),
          },
        },
      ],
    }).compile();

    controller = module.get(LoopController);
  });

  it('delegates getContract to the service', async () => {
    const payload = { contract: null, localDate: '2026-08-14', primaryAmbition: null, suggestedMove: null, move: null };
    loopService.getContract.mockResolvedValue(payload);

    await expect(controller.getContract('user-1')).resolves.toEqual(payload);
    expect(loopService.getContract).toHaveBeenCalledWith('user-1', undefined);
  });
});
