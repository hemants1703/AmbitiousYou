jest.mock('src/db');

import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ProofController } from './proof.controller';
import { ProofService } from './proof.service';
import { ProGuard } from '../auth/guards/pro.guard';

describe('ProofController', () => {
  let controller: ProofController;
  let proofService: jest.Mocked<Pick<ProofService, 'listProofLogs' | 'createProofLog' | 'deleteProofLog'>>;

  beforeEach(async () => {
    proofService = {
      listProofLogs: jest.fn(),
      createProofLog: jest.fn(),
      deleteProofLog: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProofController],
      providers: [
        { provide: ProofService, useValue: proofService },
        {
          provide: ProGuard,
          useValue: {
            canActivate: jest.fn().mockRejectedValue(new ForbiddenException('Pro access required')),
          },
        },
      ],
    }).compile();

    controller = module.get(ProofController);
  });

  it('delegates list to the service', async () => {
    const payload = [{ id: 'proof-1', proofTitle: 'Test', proofNote: null, createdAt: new Date() }];
    proofService.listProofLogs.mockResolvedValue(payload);

    await expect(controller.list('user-1')).resolves.toEqual(payload);
    expect(proofService.listProofLogs).toHaveBeenCalledWith('user-1');
  });

  it('delegates create to the service', async () => {
    const payload = { id: 'proof-1', proofTitle: 'Test', proofNote: null, createdAt: new Date() };
    proofService.createProofLog.mockResolvedValue(payload);

    await expect(controller.create('user-1', { proofTitle: 'Test' })).resolves.toEqual(payload);
    expect(proofService.createProofLog).toHaveBeenCalledWith('user-1', { proofTitle: 'Test' });
  });

  it('delegates remove to the service', async () => {
    proofService.deleteProofLog.mockResolvedValue(undefined);

    await expect(controller.remove('user-1', 'proof-1')).resolves.toBeUndefined();
    expect(proofService.deleteProofLog).toHaveBeenCalledWith('user-1', 'proof-1');
  });
});
