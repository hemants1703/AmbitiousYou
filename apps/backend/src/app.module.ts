import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { TasksModule } from './tasks/tasks.module';
import { MilestonesModule } from './milestones/milestones.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.development', '.env.production'] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('PG_HOST'),
        port: configService.getOrThrow<number>('PG_PORT'),
        database: configService.getOrThrow<string>('PG_DATABASE'),
        username: configService.getOrThrow<string>('PG_USER'),
        password: configService.getOrThrow<string>('PG_PASSWORD'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,

        // We only need this as true in development mode and not in production mode
        // synchronize: process.env.NODE_ENV === 'development' ? true : false,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    NotesModule,
    TasksModule,
    MilestonesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
