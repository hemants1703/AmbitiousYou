import {
  Controller,
  Get,
  HttpCode,
  ServiceUnavailableException,
} from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from './db';

/**
 * Readiness probe used by the Docker HEALTHCHECK and the blue-green deploy
 * script's health gate. Unlike `GET /` (a trivial liveness string), this pings
 * the database with a cheap `SELECT 1` so the reverse proxy only cuts traffic
 * over to a container that can actually reach Postgres.
 *
 * 200 -> ready; 503 -> DB unreachable (proxy keeps the old container live).
 */
@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  async check(): Promise<{ status: string; db: string }> {
    try {
      await db.execute(sql`select 1`);
      return { status: 'ok', db: 'up' };
    } catch {
      throw new ServiceUnavailableException({ status: 'error', db: 'down' });
    }
  }
}
