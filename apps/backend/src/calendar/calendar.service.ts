import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db, calendarIntegrations } from '../db';
import { LoopService } from '../loop/loop.service';

export type CalendarStatusPayload = {
  connected: boolean;
  provider: 'google' | null;
  calendarId: string | null;
};

@Injectable()
export class CalendarService {
  constructor(private readonly loopService: LoopService) {}

  getStatus(userId: string): Promise<CalendarStatusPayload> {
    return this.loadStatus(userId);
  }

  getConnectUrl(userId: string): { url: string } {
    const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim();
    const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI?.trim();
    if (!clientId || !redirectUri) {
      throw new ServiceUnavailableException('Google Calendar is not configured on this server.');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar.events',
      access_type: 'offline',
      prompt: 'consent',
      state: userId,
    });

    return { url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` };
  }

  async blockTodayContract(userId: string): Promise<{ eventId: string | null; htmlLink: string | null }> {
    const integration = await this.loadIntegration(userId);
    if (!integration) {
      throw new ServiceUnavailableException('Connect Google Calendar first.');
    }

    const contractPayload = await this.loopService.getContract(userId);
    const move = contractPayload.move ?? contractPayload.suggestedMove;
    if (!move) {
      throw new ServiceUnavailableException('No contract move to block on the calendar.');
    }

    const accessToken = await this.ensureAccessToken(integration);
    const start = new Date();
    start.setMinutes(0, 0, 0);
    start.setHours(start.getHours() + 1);
    const end = new Date(start.getTime() + 45 * 60 * 1000);

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `Today's move: ${move.title}`,
        description: contractPayload.primaryAmbition?.ambitionName ?? undefined,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      }),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException('Failed to create calendar event.');
    }

    const payload = (await response.json()) as { id?: string; htmlLink?: string };
    return { eventId: payload.id ?? null, htmlLink: payload.htmlLink ?? null };
  }

  private async loadStatus(userId: string): Promise<CalendarStatusPayload> {
    const integration = await this.loadIntegration(userId);
    if (!integration) {
      return { connected: false, provider: null, calendarId: null };
    }
    return { connected: true, provider: 'google', calendarId: integration.calendarId };
  }

  private async loadIntegration(userId: string) {
    const [row] = await db.select().from(calendarIntegrations).where(eq(calendarIntegrations.userId, userId)).limit(1);
    return row ?? null;
  }

  private async ensureAccessToken(integration: typeof calendarIntegrations.$inferSelect): Promise<string> {
    const expiresAt = integration.tokenExpiresAt?.getTime() ?? 0;
    if (Date.now() < expiresAt - 60_000) {
      return integration.accessToken;
    }

    const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim();
    if (!clientId || !clientSecret || !integration.refreshToken) {
      throw new ServiceUnavailableException('Google Calendar token expired. Reconnect.');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: integration.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException('Failed to refresh Google Calendar token.');
    }

    const payload = (await response.json()) as { access_token: string; expires_in?: number };
    const tokenExpiresAt = new Date(Date.now() + (payload.expires_in ?? 3600) * 1000);

    await db
      .update(calendarIntegrations)
      .set({ accessToken: payload.access_token, tokenExpiresAt })
      .where(and(eq(calendarIntegrations.id, integration.id), eq(calendarIntegrations.userId, integration.userId)));

    return payload.access_token;
  }
}
