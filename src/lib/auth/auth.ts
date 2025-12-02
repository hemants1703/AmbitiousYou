import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log("[AUTH] sendResetPassword");
      console.log("[AUTH] url", url);
      console.log("[AUTH] token", token);
      console.log("[AUTH] request", request);

      const sendPasswordResetEmailResult = await fetch(
        `${process.env.MAIL_SERVICE_BASE_URL}/send-password-reset-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: user.email,
            username: user.name.split(" ")[0],
            passwordResetLink: url,
          }),
        }
      );

      if (!sendPasswordResetEmailResult.ok) {
        console.error(
          "Error sending password reset email:",
          await sendPasswordResetEmailResult.json()
        );
      }
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
      console.log("request", request);

      const sendPasswordResetConfirmationEmailResult = await fetch(
        `${process.env.MAIL_SERVICE_BASE_URL}/send-password-reset-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: user.email,
            username: user.name.split(" ")[0],
          }),
        }
      );

      if (!sendPasswordResetConfirmationEmailResult.ok) {
        console.error(
          "Error sending password reset confirmation email:",
          await sendPasswordResetConfirmationEmailResult.json()
        );
      }
    },
  },
  plugins: [nextCookies()],
});
