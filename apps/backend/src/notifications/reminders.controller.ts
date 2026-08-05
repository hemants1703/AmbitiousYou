import { Controller, Post, UseGuards } from '@nestjs/common';
import { CronSecretGuard } from './cron-secret.guard';
import { RemindersService, type ReminderSweepResult } from './reminders.service';

@Controller('internal/reminders')
@UseGuards(CronSecretGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post('run')
  async runDueTodaySweep(): Promise<ReminderSweepResult> {
    return await this.remindersService.runDueTodaySweep();
  }
}
