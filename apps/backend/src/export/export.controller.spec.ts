jest.mock('src/db');

import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { ProGuard } from '../auth/guards/pro.guard';

describe('ExportController', () => {
  let controller: ExportController;
  let exportService: jest.Mocked<Pick<ExportService, 'buildAmbitionsCsv'>>;

  beforeEach(async () => {
    exportService = {
      buildAmbitionsCsv: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
      providers: [
        { provide: ExportService, useValue: exportService },
        {
          provide: ProGuard,
          useValue: {
            canActivate: jest.fn().mockRejectedValue(new ForbiddenException('Pro access required')),
          },
        },
      ],
    }).compile();

    controller = module.get(ExportController);
  });

  it('delegates exportAmbitionsCsv to the service', async () => {
    const payload = 'csv,data\n1,test';
    exportService.buildAmbitionsCsv.mockResolvedValue(payload);

    await expect(controller.exportAmbitionsCsv('user-1')).resolves.toEqual(payload);
    expect(exportService.buildAmbitionsCsv).toHaveBeenCalledWith('user-1');
  });
});
