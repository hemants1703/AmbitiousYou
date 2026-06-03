import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Global default-deny for passwordHash — replicates TypeORM's `select: false`.
    // Override per-query with `omit: { passwordHash: false }` when the hash is needed (login).
    super({ omit: { user: { passwordHash: true } } });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
