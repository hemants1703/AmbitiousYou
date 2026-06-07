"use server";

export type ForgotPasswordState = {
  error: string | null;
  success: boolean;
};

export async function forgotPasswordAction(_: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Please enter your email address.", success: false };
  }

  try {
    const response = await fetch(`${process.env.API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      return { error: "Unable to process your request. Please try again.", success: false };
    }
  } catch {
    return { error: "Unable to process your request. Please try again.", success: false };
  }

  // Always a generic success — never reveal whether the email is registered.
  return { error: null, success: true };
}
