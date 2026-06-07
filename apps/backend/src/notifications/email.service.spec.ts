/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- assertions read into the mocked Azure EmailClient's `any`-typed beginSend payload. */
import { EmailService } from './email.service';

const beginSendMock = jest.fn().mockResolvedValue(undefined);

jest.mock('@azure/communication-email', () => ({
  EmailClient: jest.fn().mockImplementation(() => ({ beginSend: beginSendMock })),
}));

describe('EmailService', () => {
  let service: EmailService;
  const originalConnectionString = process.env.AZURE_CONNECTION_STRING;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AZURE_CONNECTION_STRING = 'endpoint=https://test.communication.azure.com/;accesskey=test';
    service = new EmailService();
  });

  afterAll(() => {
    process.env.AZURE_CONNECTION_STRING = originalConnectionString;
  });

  it('renders the verification template and sends it via Azure', async () => {
    await service.sendVerificationEmail('user@example.com', 'Ada', 'https://app.test/verify-email?token=abc');

    expect(beginSendMock).toHaveBeenCalledTimes(1);
    const message = beginSendMock.mock.calls[0][0];
    expect(message.senderAddress).toBe('donotreply@ambitiousyou.pro');
    expect(message.recipients.to).toEqual([{ address: 'user@example.com' }]);
    expect(message.content.subject).toContain('Verify Your Email');
    expect(message.content.html).toContain('Ada');
    expect(message.content.html).toContain('https://app.test/verify-email?token=abc');
    expect(message.content.html).not.toContain('{{USERNAME}}');
    expect(message.content.html).not.toContain('{{VERIFICATION_LINK}}');
  });

  it('fills both reset-link placeholders in the password-reset template', async () => {
    const link = 'https://app.test/reset-password?token=xyz';
    await service.sendPasswordResetEmail('user@example.com', 'Ada', link);

    const html = beginSendMock.mock.calls[0][0].content.html as string;
    expect(html).not.toContain('{{RESET_LINK_BUTTON}}');
    expect(html).not.toContain('{{RESET_LINK}}');
    // The URL appears in both the button href and the copyable plain-text link.
    expect(html.split(link).length - 1).toBeGreaterThanOrEqual(2);
  });

  it('skips sending when the Azure connection string is absent', async () => {
    delete process.env.AZURE_CONNECTION_STRING;
    const unconfigured = new EmailService();

    await unconfigured.sendWelcomeEmail('user@example.com', 'Ada', 'https://app.test/dashboard');

    expect(beginSendMock).not.toHaveBeenCalled();
  });
});
