import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { closeDatabase } from './db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
