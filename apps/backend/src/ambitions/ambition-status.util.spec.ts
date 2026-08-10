import { BadRequestException } from '@nestjs/common';
import { db } from '../db';
import { buildChain } from '../test-utils/db-chain';
import {
  assertAmbitionAcceptsNewMoves,
  isAmbitionWindowClosed,
  markOverdueAmbitionsMissed,
  syncAmbitionMissedStatus,
} from './ambition-status.util';

jest.mock('src/db');

describe('ambition-status.util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isAmbitionWindowClosed', () => {
    const now = new Date('2026-08-10T12:00:00.000Z');

    it('is open for active ambitions whose end date is today or later', () => {
      expect(
        isAmbitionWindowClosed({ ambitionStatus: 'active', ambitionEndDate: new Date('2026-08-10T00:00:00.000Z') }, now),
      ).toBe(false);
      expect(
        isAmbitionWindowClosed({ ambitionStatus: 'active', ambitionEndDate: new Date('2026-08-11T00:00:00.000Z') }, now),
      ).toBe(false);
    });

    it('is closed for missed or overdue active ambitions', () => {
      expect(
        isAmbitionWindowClosed({ ambitionStatus: 'missed', ambitionEndDate: new Date('2026-08-11T00:00:00.000Z') }, now),
      ).toBe(true);
      expect(
        isAmbitionWindowClosed({ ambitionStatus: 'active', ambitionEndDate: new Date('2026-08-09T00:00:00.000Z') }, now),
      ).toBe(true);
    });

    it('is open for completed ambitions even after the end date', () => {
      expect(
        isAmbitionWindowClosed({ ambitionStatus: 'completed', ambitionEndDate: new Date('2020-01-01T00:00:00.000Z') }, now),
      ).toBe(false);
    });
  });

  describe('assertAmbitionAcceptsNewMoves', () => {
    it('allows open windows', async () => {
      await expect(
        assertAmbitionAcceptsNewMoves(
          db as never,
          { id: 'a1', ambitionStatus: 'active', ambitionEndDate: new Date('2099-01-01T00:00:00.000Z') },
          new Date('2026-08-10T12:00:00.000Z'),
        ),
      ).resolves.toBeUndefined();
      expect(db.update).not.toHaveBeenCalled();
    });

    it('flips overdue active to missed then rejects', async () => {
      (db.update as jest.Mock).mockReturnValueOnce(buildChain([{ id: 'a1' }]));

      await expect(
        assertAmbitionAcceptsNewMoves(
          db as never,
          { id: 'a1', ambitionStatus: 'active', ambitionEndDate: new Date('2020-01-01T00:00:00.000Z') },
          new Date('2026-08-10T12:00:00.000Z'),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(db.update).toHaveBeenCalled();
    });
  });

  describe('markOverdueAmbitionsMissed', () => {
    it('returns the number of rows flipped', async () => {
      (db.update as jest.Mock).mockReturnValueOnce(buildChain([{ id: 'a1' }, { id: 'a2' }]));

      await expect(markOverdueAmbitionsMissed({ now: new Date('2026-08-10T12:00:00.000Z') })).resolves.toBe(2);
    });
  });

  describe('syncAmbitionMissedStatus', () => {
    it('returns the same row when still inside the window', async () => {
      const ambition = {
        id: 'a1',
        ambitionStatus: 'active' as const,
        ambitionEndDate: new Date('2099-01-01T00:00:00.000Z'),
      };

      await expect(syncAmbitionMissedStatus(ambition, new Date('2026-08-10T12:00:00.000Z'))).resolves.toBe(ambition);
      expect(db.update).not.toHaveBeenCalled();
    });

    it('persists missed for overdue active ambitions', async () => {
      const ambition = {
        id: 'a1',
        ambitionStatus: 'active' as const,
        ambitionEndDate: new Date('2020-01-01T00:00:00.000Z'),
      };
      const updated = { ...ambition, ambitionStatus: 'missed' as const };
      (db.update as jest.Mock).mockReturnValueOnce(buildChain([updated]));

      await expect(syncAmbitionMissedStatus(ambition, new Date('2026-08-10T12:00:00.000Z'))).resolves.toEqual(updated);
    });
  });
});
