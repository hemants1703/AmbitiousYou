import { BadRequestException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { db, settings, type Settings } from 'src/db';

@Injectable()
export class SettingsService {
  async createSettingsForUserId(userId: string): Promise<Settings> {
    const [created] = await db
      .insert(settings)
      .values({
        userId,
        userTimezone: '',
        emailAccountActivity: true,
        pushAmbitionReminders: false,
      })
      .returning();
    return created;
  }

  async findAllSettingsForUserId(userId: string): Promise<Settings> {
    const [row] = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
    if (!row) {
      throw new BadRequestException('Settings not found for the user');
    }
    return row;
  }

  async updateSettingForUserId(userId: string, updateSettingDto: UpdateSettingDto): Promise<Settings> {
    const [existing] = await db.select({ id: settings.id }).from(settings).where(eq(settings.userId, userId)).limit(1);
    if (!existing) {
      throw new BadRequestException('Setting not found');
    }

    const [updated] = await db
      .update(settings)
      .set({ ...updateSettingDto })
      .where(eq(settings.userId, userId))
      .returning();
    return updated;
  }
}
