import { db } from "@/db";
import { account, session, User, user, verification } from "@/db/schema";
import { EmailServices } from "@/services/emailServices";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailVerification: {
    sendOnSignUp: true, // Send Email Verification Link on Sign Up (i.e. new account creation)
    sendVerificationEmail: async ({ user, url }) => {
      new EmailServices().sendEmailVerificationLink({
        to: user.email as string,
        username: user.name.split(" ")[0] as string,
        link: url as string,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      new EmailServices().sendResetPasswordLink({
        to: user.email,
        username: user.name.split(" ")[0],
        link: url,
      });
    },
    onPasswordReset: async ({ user }) => {
      new EmailServices().sendPasswordResetConfirmation({
        to: user.email,
        username: user.name.split(" ")[0],
      });
    },
  },
  plugins: [nextCookies()],
});
