interface SendEmailProps {
  address: string;
  username: string;
  link: string;
}

export class EmailService {
  async sendWelcomeEmail({ address, username }: Partial<SendEmailProps>) {
    console.log("[AUTH] sendWelcomeEmail");

    const result = await fetch(`${process.env.NOTIFICATIONS_SERVICE_BASE_URL}/api/email/send-welcome`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, username }),
    });

    if (!result.ok) {
      console.error("Failed to send welcome email", await result.json());
    }
  }

  async sendEmailVerificationLink({ address, username, link }: SendEmailProps) {
    console.log("[AUTH] sendEmailVerification");
    console.log("[AUTH] url", link);

    const result = await fetch(`${process.env.NOTIFICATIONS_SERVICE_BASE_URL}/api/email/send-email-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        username,
        verificationLink: link,
      }),
    });

    if (!result.ok) {
      console.error("Failed to send email verification link", await result.json());
    }
  }

  async sendResetPasswordLink({ address, username, link }: SendEmailProps) {
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
          address,
          username,
          passwordResetLink: link,
        }),
      }
    );

    if (!sendPasswordResetEmailResult.ok) {
      console.error("Failed to send password reset link:", await sendPasswordResetEmailResult.json());
    }
  }

  async sendPasswordResetConfirmation({ address, username }: Partial<SendEmailProps>) {
    console.log(`Password for user ${address} has been reset.`);

    const sendPasswordResetConfirmationEmailResult = await fetch(
      `${process.env.NOTIFICATIONS_SERVICE_BASE_URL}/api/email/send-password-reset-confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
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
