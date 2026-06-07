/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return -- intentional `any` typing for the chainable test double. */

/**
 * Jest auto-mock for `src/db`. Activated in any spec via `jest.mock('src/db')`.
 *
 * - `db.select() / insert() / update() / delete()` return a default chainable
 *   resolving to `[]`. Stage a specific row in a test:
 *
 *     import { db } from 'src/db';
 *     import { buildChain } from 'src/test-utils/db-chain';
 *     (db.insert as jest.Mock).mockReturnValueOnce(buildChain([createdRow]));
 *
 * - `db.transaction(cb)` invokes the callback with the same mock as `tx`, so
 *   transactional code paths exercise the same chain mocks.
 *
 * - The schema re-exports are the REAL Drizzle table objects from the shared
 *   package (`@ambitiousyou/shared/db`). They're pure column metadata — no
 *   pool, no connection, no env vars required — so call-time helpers like
 *   `getTableColumns(users)` keep working unmodified.
 */

import { buildChain } from '../../test-utils/db-chain';

const dbMock: any = {
  select: jest.fn(() => buildChain()),
  insert: jest.fn(() => buildChain()),
  update: jest.fn(() => buildChain()),
  delete: jest.fn(() => buildChain()),
  transaction: jest.fn(async (cb: (tx: any) => Promise<unknown>) => cb(dbMock)),
};

export const db = dbMock;
export const closeDatabase = jest.fn();

// Re-export the real schema from shared. Schema files only declare metadata
// via `pgTable(...)`, so importing them here doesn't touch `client.ts` (which
// is the only file that actually creates a pg.Pool).
export * from '@ambitiousyou/shared/db';
