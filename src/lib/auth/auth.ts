import { db } from "@/db";
import { account, session, User, user, verification } from "@/db/schema";
import { EmailService } from "@/services/emailService";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL?.replace(/^["']|["']$/g, ""),
  trustedOrigins: [
    (process.env.NOTIFICATIONS_SERVICE_BASE_URL as string)?.replace(/^["']|["']$/g, ""),
    "https://ambitiousyou.pro",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailVerification: {
    sendOnSignUp: true, // Send Email Verification Link on Sign Up (i.e. new account creation)
    sendVerificationEmail: async ({ user, url }) => {
      new EmailService().sendEmailVerificationLink({
        address: user.email as string,
        username: user.name.split(" ")[0] as string,
        link: url as string,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      new EmailService().sendResetPasswordLink({
        address: user.email,
        username: user.name.split(" ")[0],
        link: url,
      });
    },
    onPasswordReset: async ({ user }) => {
      new EmailService().sendPasswordResetConfirmation({
        address: user.email,
        username: user.name.split(" ")[0],
      });
    },
  },
  plugins: [nextCookies()],
});
