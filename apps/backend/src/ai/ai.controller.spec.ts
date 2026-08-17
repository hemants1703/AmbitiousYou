jest.mock('src/db');

import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ProGuard } from '../auth/guards/pro.guard';

describe('AiController', () => {
  let controller: AiController;
  let aiService: jest.Mocked<Pick<AiService, 'breakdownAmbition' | 'acceptBreakdown' | 'chat' | 'indexUserCorpus'>>;

  beforeEach(async () => {
    aiService = {
      breakdownAmbition: jest.fn(),
      acceptBreakdown: jest.fn(),
      chat: jest.fn(),
      indexUserCorpus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        { provide: AiService, useValue: aiService },
        {
          provide: ProGuard,
          useValue: {
            canActivate: jest.fn().mockRejectedValue(new ForbiddenException('Pro access required')),
          },
        },
      ],
    }).compile();

    controller = module.get(AiController);
  });

  it('delegates breakdown to the service', async () => {
    const payload = { tasks: [], milestones: [] };
    aiService.breakdownAmbition.mockResolvedValue(payload);

    await expect(controller.breakdown('user-1', 'ambition-1')).resolves.toEqual(payload);
    expect(aiService.breakdownAmbition).toHaveBeenCalledWith('user-1', 'ambition-1');
  });

  it('delegates acceptBreakdown to the service', async () => {
    aiService.acceptBreakdown.mockResolvedValue(undefined);

    await expect(controller.acceptBreakdown('user-1', 'ambition-1', { tasks: [], milestones: [] })).resolves.toEqual({ success: true });
    expect(aiService.acceptBreakdown).toHaveBeenCalledWith('user-1', 'ambition-1', { tasks: [], milestones: [] });
  });

  it('delegates chat to the service', async () => {
    const payload = { answer: 'test', citations: [] };
    aiService.chat.mockResolvedValue(payload);

    await expect(controller.chat('user-1', { message: 'hello' })).resolves.toEqual(payload);
    expect(aiService.chat).toHaveBeenCalledWith('user-1', 'hello');
  });

  it('delegates index to the service', async () => {
    const payload = { indexed: 5 };
    aiService.indexUserCorpus.mockResolvedValue(payload);

    await expect(controller.index('user-1')).resolves.toEqual(payload);
    expect(aiService.indexUserCorpus).toHaveBeenCalledWith('user-1');
  });
});
