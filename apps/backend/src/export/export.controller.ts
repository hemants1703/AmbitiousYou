import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ProGuard } from '../auth/guards/pro.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { ExportService } from './export.service';

@Controller('export')
@UseGuards(SessionGuard, ProGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('ambitions.csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="ambitions-export.csv"')
  async exportAmbitionsCsv(@CurrentUserId() userId: string): Promise<string> {
    return this.exportService.buildAmbitionsCsv(userId);
  }
}
