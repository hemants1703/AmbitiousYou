/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return -- intentional `any` typing for the chainable test double. */

/**
 * Build a chainable thenable that mirrors Drizzle's fluent SQL builder API.
 * Every chain method (`.values`, `.where`, `.limit`, `.returning`, ...) returns
 * the same builder; `await`ing the chain resolves to whatever `resolved` was
 * passed in. Used by:
 *   - the auto-mock at `src/db/__mocks__/index.ts` as the default chain
 *   - specs that need to stage a specific row, via:
 *
 *     (db.insert as jest.Mock).mockReturnValueOnce(buildChain([createdRow]));
 */
export const buildChain = (resolved: unknown = []) => {
  const chain: any = {};
  for (const m of ['values', 'set', 'where', 'limit', 'returning', 'from', 'orderBy', 'innerJoin', 'leftJoin', 'groupBy']) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain.then = (resolve: (v: unknown) => void) => resolve(resolved);
  return chain;
};
