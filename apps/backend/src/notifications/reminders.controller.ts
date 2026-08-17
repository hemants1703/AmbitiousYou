import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CronSecretGuard } from './cron-secret.guard';
import { RemindersService, type ReminderSweepResult } from './reminders.service';

@Controller('internal/reminders')
@UseGuards(CronSecretGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  /** GET for Vercel Cron; POST kept for manual curl / legacy triggers. */
  @Get('run')
  @Post('run')
  async runDueTodaySweep(): Promise<ReminderSweepResult> {
    return await this.remindersService.runDueTodaySweep();
  }
}
