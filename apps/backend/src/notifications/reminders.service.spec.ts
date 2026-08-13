jest.mock('../db');

import { db } from '../db';
import { buildChain } from '../test-utils/db-chain';
import { PushService } from './push.service';
import { RemindersService } from './reminders.service';

describe('RemindersService', () => {
  const pushService = {
    sendToUser: jest.fn(),
  } as unknown as PushService;

  let service: RemindersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RemindersService(pushService);
  });

  describe('slot resolution', () => {
    it('opens morning at 09:xx and evening at 18:xx only', () => {
      expect(service.resolveCronSlot('UTC', new Date('2026-08-05T09:00:00.000Z'))).toBe('morning');
      expect(service.resolveCronSlot('UTC', new Date('2026-08-05T09:45:00.000Z'))).toBe('morning');
      expect(service.resolveCronSlot('UTC', new Date('2026-08-05T12:00:00.000Z'))).toBeNull();
      expect(service.resolveCronSlot('UTC', new Date('2026-08-05T17:59:00.000Z'))).toBeNull();
      expect(service.resolveCronSlot('UTC', new Date('2026-08-05T18:00:00.000Z'))).toBe('evening');
      expect(service.resolveCronSlot('UTC', new Date('2026-08-05T08:59:00.000Z'))).toBeNull();
    });

    it('manual slot is morning before 18:00 and evening after', () => {
      expect(service.resolveManualSlot('UTC', new Date('2026-08-05T08:00:00.000Z'))).toBe('morning');
      expect(service.resolveManualSlot('UTC', new Date('2026-08-05T17:59:00.000Z'))).toBe('morning');
      expect(service.resolveManualSlot('UTC', new Date('2026-08-05T18:00:00.000Z'))).toBe('evening');
    });
  });

  it('skips users before the 9 AM local window during cron', async () => {
    (db.select as jest.Mock).mockReturnValueOnce(buildChain([{ userId: 'user-1', userTimezone: 'UTC' }]));

    const result = await service.runDueTodaySweep(new Date('2026-08-05T08:00:00.000Z'));

    expect(result.usersScanned).toBe(1);
    expect(result.usersInSlot).toBe(0);
    expect(result.notificationsCreated).toBe(0);
    expect(pushService.sendToUser).not.toHaveBeenCalled();
  });

  it('creates morning notifications for due/overdue tasks', async () => {
    (db.select as jest.Mock)
      .mockReturnValueOnce(buildChain([{ userId: 'user-1', userTimezone: 'UTC' }]))
      .mockReturnValueOnce(
        buildChain([
          {
            id: 'task-1',
            label: 'Ship reminders',
            ambitionId: 'amb-1',
            ambitionName: 'Launch',
            dueDate: new Date('2026-07-31T00:00:00.000Z'),
          },
        ]),
      )
      .mockReturnValueOnce(buildChain([]))
      .mockReturnValueOnce(buildChain([]));

    const created = {
      id: 'notif-1',
      userId: 'user-1',
      type: 'task_due_today',
      title: 'Task overdue',
      body: 'Ship reminders · Launch',
      href: '/ambitions/amb-1',
      ambitionId: 'amb-1',
      resourceId: 'task-1',
      dedupeKey: 'task_due_today:task-1:2026-08-05:morning',
      readAt: null,
      createdAt: new Date(),
    };

    (db.insert as jest.Mock).mockReturnValueOnce(buildChain([created]));

    const result = await service.runDueTodaySweep(new Date('2026-08-05T09:00:00.000Z'));

    expect(result.usersInSlot).toBe(1);
    expect(result.notificationsCreated).toBe(1);
    expect(result.pushesAttempted).toBe(1);
    expect(pushService.sendToUser).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        title: 'Task overdue',
        href: '/ambitions/amb-1',
      }),
    );
  });

  it('creates evening follow-up when items are still incomplete', async () => {
    (db.select as jest.Mock)
      .mockReturnValueOnce(buildChain([{ userId: 'user-1', userTimezone: 'UTC' }]))
      .mockReturnValueOnce(
        buildChain([
          {
            id: 'task-1',
            label: 'Ship reminders',
            ambitionId: 'amb-1',
            ambitionName: 'Launch',
            dueDate: new Date('2026-08-05T00:00:00.000Z'),
          },
        ]),
      )
      .mockReturnValueOnce(buildChain([]))
      .mockReturnValueOnce(buildChain([]));

    const created = {
      id: 'notif-2',
      userId: 'user-1',
      type: 'task_due_today',
      title: 'Still due today',
      body: 'Ship reminders · Launch',
      href: '/ambitions/amb-1',
      ambitionId: 'amb-1',
      resourceId: 'task-1',
      dedupeKey: 'task_due_today:task-1:2026-08-05:evening',
      readAt: null,
      createdAt: new Date(),
    };

    (db.insert as jest.Mock).mockReturnValueOnce(buildChain([created]));

    const result = await service.runDueTodaySweep(new Date('2026-08-05T18:00:00.000Z'));

    expect(result.notificationsCreated).toBe(1);
    expect(pushService.sendToUser).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        title: 'Still due today',
      }),
    );
  });

  it('skips push when dedupe insert hits unique violation', async () => {
    (db.select as jest.Mock)
      .mockReturnValueOnce(buildChain([{ userId: 'user-1', userTimezone: 'UTC' }]))
      .mockReturnValueOnce(
        buildChain([
          {
            id: 'task-1',
            label: 'Ship reminders',
            ambitionId: 'amb-1',
            ambitionName: 'Launch',
            dueDate: new Date('2026-08-05T00:00:00.000Z'),
          },
        ]),
      )
      .mockReturnValueOnce(buildChain([]))
      .mockReturnValueOnce(buildChain([]));

    (db.insert as jest.Mock).mockImplementationOnce(() => {
      const error = Object.assign(new Error('duplicate'), { code: '23505' });
      return {
        values: () => ({
          returning: async () => {
            throw error;
          },
        }),
      };
    });

    const result = await service.runDueTodaySweep(new Date('2026-08-05T09:00:00.000Z'));

    expect(result.notificationsCreated).toBe(0);
    expect(result.pushesAttempted).toBe(0);
    expect(pushService.sendToUser).not.toHaveBeenCalled();
  });
});
