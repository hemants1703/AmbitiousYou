import { Injectable, Logger } from '@nestjs/common';
import { EmailClient } from '@azure/communication-email';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Verified sender on the Azure Communication Services Email resource.
const SENDER_ADDRESS = 'donotreply@ambitiousyou.pro';

// Templates are copied next to the compiled service via the `assets` entry in
// nest-cli.json, so `__dirname` resolves to dist/notifications at runtime (and
// to src/notifications under jest, where the real files also live).
const TEMPLATE_DIR = join(__dirname, 'templates', 'email');

type TemplateName = 'verify-email' | 'signup-welcome' | 'password-reset' | 'password-reset-verification' | 'password-update-confirmation';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly client: EmailClient | null;
  private readonly templateCache = new Map<TemplateName, string>();

  constructor() {
    const connectionString = process.env.AZURE_CONNECTION_STRING;
    if (!connectionString) {
      this.logger.warn('AZURE_CONNECTION_STRING is not set — transactional emails will be skipped.');
      this.client = null;
    } else {
      this.client = new EmailClient(connectionString);
    }
  }

  async sendVerificationEmail(to: string, name: string, verificationLink: string): Promise<void> {
    const html = this.render('verify-email', { USERNAME: name, VERIFICATION_LINK: verificationLink });
    await this.send(to, 'Verify Your Email - AmbitiousYou', html);
  }

  async sendWelcomeEmail(to: string, name: string, dashboardLink: string): Promise<void> {
    const html = this.render('signup-welcome', { USERNAME: name, DASHBOARD_LINK: dashboardLink });
    await this.send(to, 'Welcome to AmbitiousYou!', html);
  }

  async sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<void> {
    // The template references the reset URL twice (the button and the copyable
    // plain-text link) — both get the same URL.
    const html = this.render('password-reset', { USERNAME: name, RESET_LINK_BUTTON: resetLink, RESET_LINK: resetLink });
    await this.send(to, 'Reset Your Password - AmbitiousYou', html);
  }

  async sendPasswordResetConfirmationEmail(to: string, name: string, loginLink: string): Promise<void> {
    const html = this.render('password-reset-verification', { USERNAME: name, LOGIN_LINK: loginLink });
    await this.send(to, 'Password Changed Successfully - AmbitiousYou', html);
  }

  async sendPasswordChangedEmail(to: string, name: string): Promise<void> {
    const html = this.render('password-update-confirmation', { USERNAME: name });
    await this.send(to, 'Password Updated Successfully - AmbitiousYou', html);
  }

  private render(template: TemplateName, replacements: Record<string, string>): string {
    let html = this.loadTemplate(template);
    for (const [token, value] of Object.entries(replacements)) {
      html = html.replaceAll(`{{${token}}}`, value);
    }
    return html;
  }

  private loadTemplate(template: TemplateName): string {
    const cached = this.templateCache.get(template);
    if (cached) return cached;

    const html = readFileSync(join(TEMPLATE_DIR, `${template}.html`), 'utf8');
    this.templateCache.set(template, html);
    return html;
  }

  /**
   * Sends one email. Self-contained and never throws — callers fire-and-forget
   * (`void emailService.sendX(...)`) so the HTTP response doesn't block on
   * Azure's send, and a delivery failure is logged rather than surfaced.
   */
  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.client) {
      this.logger.warn(`Skipping email "${subject}" to ${to} — Azure email client is not configured.`);
      return;
    }

    try {
      // `beginSend` resolving means the message was accepted by ACS; we don't
      // poll for terminal delivery state on the request path.
      await this.client.beginSend({
        senderAddress: SENDER_ADDRESS,
        content: { subject, html },
        recipients: { to: [{ address: to }] },
      });
    } catch (error) {
      this.logger.error(`Failed to send email "${subject}" to ${to}`, error as Error);
    }
  }
}
