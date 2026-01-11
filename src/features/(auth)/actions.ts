"use server";

import { auth } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import z from "zod";
import { ForgotPasswordSchema, LoginSchema, ResetPasswordSchema, SignupSchema } from "./validation";
import { db } from "@/db";
import { settings, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface SignupActionState {
  errors?: Record<string, string[]>;

  fullName: string;
  email: string;
  password: string;
  userTimezone: string;
}

// This function is called when the user submits the signup form
export async function signupAction(_: SignupActionState, formData: FormData): Promise<SignupActionState> {
  const submittedFormData: SignupActionState = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    userTimezone: formData.get("userTimezone") as string,
  };
  const validatedData = SignupSchema.safeParse(submittedFormData);

  // If the validation fails, return the errors to the client
  if (!validatedData.success) {
    console.log("validationResult", validatedData.error);
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  try {
    // Create a new user
    const userCreationResponse = await auth.api.signUpEmail({
      body: {
        name: validatedData.data.fullName,
        email: validatedData.data.email,
        password: validatedData.data.password,
        callbackURL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.APP_BASE_URL,
      },
    });

    console.log("userCreationResponse", userCreationResponse);

    const userSettingsCreationResponse = await db.insert(settings).values({
      userId: userCreationResponse.user.id,
      userTimezone: validatedData.data.userTimezone,
    });

    console.log("userSettingsCreationResponse", userSettingsCreationResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      errors: {
        message: ["An error occurred while creating the user. Please try again."],
      },
      ...submittedFormData,
    };
  }

  redirect("/dashboard", RedirectType.replace);
}

export interface LoginState {
  errors?: Record<string, string[]>;

  email: string;
  password: string;
}

// This function is called when the user submits the login form
export async function loginUserAction(_: LoginState, formData: FormData) {
  const submittedFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const validatedData = LoginSchema.safeParse(submittedFormData);

  // If the validation fails, return the errors to the client
  if (!validatedData.success) {
    console.log("validationResult", z.flattenError(validatedData.error).fieldErrors);
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  try {
    const userSigninResponse = await auth.api.signInEmail({
      body: {
        email: validatedData.data.email,
        password: validatedData.data.password,
      },
      asResponse: true,
    });

    if (userSigninResponse.status === 401) {
      throw new Error("Invalid credentials");
    }

    console.log("userSigninResponse", userSigninResponse);
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      errors: {
        message: [error instanceof Error ? error.message : "An error occurred while signing in. Please try again."],
      },
      ...submittedFormData,
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard", RedirectType.replace);
}

// This function is called when the user submits the logout form
export async function logoutAction(): Promise<{ error?: string }> {
  const logoutResponse = await auth.api.signOut({
    headers: await headers(),
  });

  if (!logoutResponse.success) {
    return {
      error: "An error occurred while logging out. Please try again.",
    };
  }

  redirect("/login", RedirectType.replace);
}

export interface ForgotPasswordState {
  success?: boolean;
  errors?: Record<string, string[]>;

  email: string;
}

// This function is called when the user submits the reset password form
export async function forgotPasswordAction(_: ForgotPasswordState, formData: FormData) {
  const submittedFormData = {
    email: formData.get("email") as string,
  };
  const validatedData = ForgotPasswordSchema.safeParse(submittedFormData);

  if (!validatedData.success) {
    console.log("validationResult", z.flattenError(validatedData.error).fieldErrors);
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  const userExists = await db.select().from(user).where(eq(user.email, validatedData.data.email));

  if (userExists.length === 0) {
    return {
      errors: {
        message: ["The provided email address is not associated with any account."],
      },
      ...submittedFormData,
    };
  }

  try {
    const resetPasswordResponse = await auth.api.requestPasswordReset({
      body: {
        email: validatedData.data.email,
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/reset-password"
            : `${process.env.APP_BASE_URL}/reset-password`,
      },
    });

    console.log("resetPasswordResponse", resetPasswordResponse);
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      errors: {
        message: ["An error occurred while requesting a password reset. Please try again."],
      },
      ...submittedFormData,
    };
  }

  return {
    success: true,
    ...submittedFormData,
  };
}

export interface ResetPasswordState {
  token: string;
  success?: boolean;
  errors?: Record<string, string[]>;
  password: string;
  confirmPassword: string;
}

export async function resetPasswordAction(_: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const submittedFormData = {
    token: formData.get("token") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validatedData = ResetPasswordSchema.safeParse(submittedFormData);

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  if (validatedData.data.password !== validatedData.data.confirmPassword) {
    return {
      errors: {
        confirmPassword: ["Passwords do not match"],
      },
      ...submittedFormData,
    };
  }

  try {
    const resetResponse = await auth.api.resetPassword({
      body: {
        newPassword: validatedData.data.password,
        token: validatedData.data.token,
      },
    });

    if (!resetResponse) {
      throw new Error("Failed to reset password");
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      errors: {
        message: ["An error occurred while resetting your password. Please try again."],
      },
      ...submittedFormData,
    };
  }

  redirect("/login?reset=success", RedirectType.replace);
}
