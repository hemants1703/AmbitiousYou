interface SendEmailProps {
  to: string;
  username: string;
  link: string;
}

export class EmailService {
  async sendEmailVerificationLink({ to, username, link }: SendEmailProps) {
    console.log("[AUTH] sendEmailVerification");
    console.log("[AUTH] url", link);

    const result = await fetch(
      `${process.env.NOTIFICATIONS_SERVICE_BASE_URL}/api/email/send-email-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          username,
          verificationLink: link,
        }),
      }
    );

    if (!result.ok) {
      console.error("Failed to send email verification link", await result.json());
    }
  }

  async sendResetPasswordLink({ to, username, link }: SendEmailProps) {
    console.log("[AUTH] sendResetPassword");
    console.log("[AUTH] url", link);

    const sendPasswordResetEmailResult = await fetch(
      `${process.env.NOTIFICATIONS_SERVICE_BASE_URL}/api/email/send-password-reset-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          username,
          passwordResetLink: link,
        }),
      }
    );

    if (!sendPasswordResetEmailResult.ok) {
      console.error(
        "Failed to send password reset link:",
        await sendPasswordResetEmailResult.json()
      );
    }
  }

  async sendPasswordResetConfirmation({ to, username }: Partial<SendEmailProps>) {
    console.log(`Password for user ${to} has been reset.`);

    const sendPasswordResetConfirmationEmailResult = await fetch(
      `${process.env.NOTIFICATIONS_SERVICE_BASE_URL}/api/email/send-password-reset-confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          username,
        }),
      }
    );

    if (!sendPasswordResetConfirmationEmailResult.ok) {
      console.error(
        "Error sending password reset confirmation email:",
        await sendPasswordResetConfirmationEmailResult.json()
      );
    }
  }
}
