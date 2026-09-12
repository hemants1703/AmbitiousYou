import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CronSecretGuard } from './cron-secret.guard';
import { RemindersService, type ReminderSweepResult } from './reminders.service';

@Controller('internal/reminders')
@UseGuards(CronSecretGuard)
export class RemindersController {
  private readonly remindersService: RemindersService;

  constructor(remindersService: RemindersService) {
    this.remindersService = remindersService;
  }

  /** GET for Vercel Cron; POST kept for manual curl / legacy triggers. */
  @Get('run')
  @Post('run')
  runDueTodaySweep(): Promise<ReminderSweepResult> {
    return this.remindersService.runDueTodaySweep();
  }
}
