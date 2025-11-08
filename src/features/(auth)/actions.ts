"use server";

import { auth } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import z from "zod";
import { LoginSchema, SignupSchema } from "./validation";

export interface SignupActionState {
  errors?: Record<string, string[]>;

  fullName: string;
  email: string;
  password: string;
}

// This function is called when the user submits the signup form
export async function signupAction(
  _: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const submittedFormData = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
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
        callbackURL:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.APP_BASE_URL,
      },
    });

    console.log("userCreationResponse", userCreationResponse);
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

    console.log("userSigninResponse", userSigninResponse);
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      errors: {
        message: ["An error occurred while signing in. Please try again."],
      },
      ...submittedFormData,
    };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard", RedirectType.replace);
}

// This function is called when the user submits the logout form
export async function logoutAction() {}
