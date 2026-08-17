import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { SessionGuard } from '../auth/guards/session.guard';
import { ProGuard } from '../auth/guards/pro.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { CalendarService, type CalendarStatusPayload } from './calendar.service';
import { db, calendarIntegrations } from '../db';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('status')
  @UseGuards(SessionGuard, ProGuard)
  status(@CurrentUserId() userId: string): Promise<CalendarStatusPayload> {
    return this.calendarService.getStatus(userId);
  }

  @Get('connect')
  @UseGuards(SessionGuard, ProGuard)
  connect(@CurrentUserId() userId: string): { url: string } {
    return this.calendarService.getConnectUrl(userId);
  }

  @Get('callback')
  async callback(@Query('code') code: string | undefined, @Query('state') state: string | undefined, @Res() res: Response): Promise<void> {
    const appBase = process.env.APP_BASE_URL ?? 'http://localhost:3000';
    if (!code || !state) {
      res.redirect(`${appBase}/dashboard?calendar=error`);
      return;
    }

    const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim();
    const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI?.trim();
    if (!clientId || !clientSecret || !redirectUri) {
      res.redirect(`${appBase}/dashboard?calendar=error`);
      return;
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      res.redirect(`${appBase}/dashboard?calendar=error`);
      return;
    }

    const payload = (await tokenResponse.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };

    const tokenExpiresAt = new Date(Date.now() + (payload.expires_in ?? 3600) * 1000);

    await db
      .insert(calendarIntegrations)
      .values({
        userId: state,
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token ?? null,
        tokenExpiresAt,
        calendarId: 'primary',
      })
      .onConflictDoUpdate({
        target: calendarIntegrations.userId,
        set: {
          accessToken: payload.access_token,
          refreshToken: payload.refresh_token ?? null,
          tokenExpiresAt,
          calendarId: 'primary',
        },
      });

    res.redirect(`${appBase}/dashboard?calendar=connected`);
  }

  @Post('block-contract')
  @UseGuards(SessionGuard, ProGuard)
  blockContract(@CurrentUserId() userId: string): Promise<{ eventId: string | null; htmlLink: string | null }> {
    return this.calendarService.blockTodayContract(userId);
  }
}
