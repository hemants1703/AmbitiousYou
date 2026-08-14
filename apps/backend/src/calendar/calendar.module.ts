import { Module } from '@nestjs/common';
import { LoopModule } from '../loop/loop.module';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [LoopModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
