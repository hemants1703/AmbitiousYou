// Vercel Nest runtime keeps `src/*` path aliases; register before other imports.
// Resolved relative to this file (not CWD) — NODE_OPTIONS --require ./… fails on Vercel.
import '../register-paths.cjs';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { closeDatabase } from './db';

async function bootstrap() {
  // #region agent log
  fetch('http://127.0.0.1:7444/ingest/95ba62c0-0758-468b-a2e9-1c03441b6e71', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '0cea4e',
    },
    body: JSON.stringify({
      sessionId: '0cea4e',
      runId: 'post-fix',
      hypothesisId: 'E',
      location: 'main.ts:bootstrap',
      message: 'Nest bootstrap reached (register-paths preload OK)',
      data: {
        cwd: process.cwd(),
        nodeOptions: process.env.NODE_OPTIONS ?? null,
        hasRegisterPathsEnv: Boolean(
          process.env.NODE_OPTIONS?.includes('register-paths'),
        ),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  console.log(
    JSON.stringify({
      sessionId: '0cea4e',
      runId: 'post-fix',
      hypothesisId: 'E',
      message: 'Nest bootstrap reached (register-paths preload OK)',
      data: {
        cwd: process.cwd(),
        nodeOptions: process.env.NODE_OPTIONS ?? null,
      },
    }),
  );
  // #endregion

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Behind a single reverse proxy (nginx) in prod/dev. Trust one hop so that
  // `req.ip` (and the per-IP ThrottlerGuard) reflects the real client from
  // `X-Forwarded-For` rather than the proxy's address — otherwise every user
  // shares one rate-limit bucket. nginx sets X-Forwarded-For/X-Real-IP.
  app.set('trust proxy', 1);

  // Security response headers (X-Content-Type-Options, HSTS, etc.).
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Graceful shutdown: close the Nest app (which runs any `onModuleDestroy`
  // hooks), then drain the pg.Pool. SIGINT is sent by Ctrl+C in dev; SIGTERM
  // by orchestrators (Docker, systemd, k8s) in prod.
  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    console.log(`Received ${signal}, shutting down...`);
    await app.close();
    await closeDatabase();
    process.exit(0);
  };
  process.once('SIGTERM', (sig) => void shutdown(sig));
  process.once('SIGINT', (sig) => void shutdown(sig));

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
