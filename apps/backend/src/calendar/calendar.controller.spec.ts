jest.mock('src/db');

import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { ProGuard } from '../auth/guards/pro.guard';

describe('CalendarController', () => {
  let controller: CalendarController;
  let calendarService: jest.Mocked<Pick<CalendarService, 'getStatus' | 'getConnectUrl' | 'blockTodayContract'>>;

  beforeEach(async () => {
    calendarService = {
      getStatus: jest.fn(),
      getConnectUrl: jest.fn(),
      blockTodayContract: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        { provide: CalendarService, useValue: calendarService },
        {
          provide: ProGuard,
          useValue: {
            canActivate: jest.fn().mockRejectedValue(new ForbiddenException('Pro access required')),
          },
        },
      ],
    }).compile();

    controller = module.get(CalendarController);
  });

  it('delegates status to the service', async () => {
    const payload = { connected: false, calendarId: null };
    calendarService.getStatus.mockResolvedValue(payload);

    await expect(controller.status('user-1')).resolves.toEqual(payload);
    expect(calendarService.getStatus).toHaveBeenCalledWith('user-1');
  });

  it('delegates connect to the service', async () => {
    const payload = { url: 'https://google.com/oauth' };
    calendarService.getConnectUrl.mockResolvedValue(payload);

    await expect(controller.connect('user-1')).resolves.toEqual(payload);
    expect(calendarService.getConnectUrl).toHaveBeenCalledWith('user-1');
  });

  it('delegates blockContract to the service', async () => {
    const payload = { eventId: 'event-1', htmlLink: 'https://calendar.google.com/event/1' };
    calendarService.blockTodayContract.mockResolvedValue(payload);

    await expect(controller.blockContract('user-1')).resolves.toEqual(payload);
    expect(calendarService.blockTodayContract).toHaveBeenCalledWith('user-1');
  });
});
