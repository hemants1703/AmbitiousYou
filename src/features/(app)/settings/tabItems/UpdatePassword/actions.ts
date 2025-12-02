"use server";

import confirmSession from "@/lib/auth/confirmSession";
import { updatePasswordValidator } from "./validators";
import z from "zod";
import { auth } from "@/lib/auth/auth";
import { cookies, headers } from "next/headers";

export interface UpdatePasswordActionState {
  errors?: Record<string, string[]>;
  success?: boolean;

  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function updatePasswordAction(
  _: UpdatePasswordActionState,
  formData: FormData
): Promise<UpdatePasswordActionState> {
  const session = await confirmSession();

  const submittedFormData = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validatedData = updatePasswordValidator.safeParse(submittedFormData);

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  if (validatedData.data.newPassword !== validatedData.data.confirmPassword) {
    return {
      errors: {
        confirmPassword: ["New password and confirm password do not match"],
        newPassword: ["New password and confirm password do not match"],
      },
      ...submittedFormData,
    };
  }

  console.log("[SERVER ACTIONS] validatedData", validatedData);

  try {
    const updatePasswordResult = await auth.api.changePassword({
      body: {
        currentPassword: validatedData.data.currentPassword,
        newPassword: validatedData.data.newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    // console.log("[SERVER ACTIONS] updatePasswordResult", updatePasswordResult);
  } catch (error) {
    console.error("[SERVER ACTIONS] Error updating password:", (error as any).body?.message);
    return {
      errors: {
        general: [(error as any).body?.message ?? "Failed to update password"],
        currentPassword:
          (error as any).body.code === "INVALID_PASSWORD" ? ["Current password is incorrect"] : [],
      },
      ...submittedFormData,
    };
  }

  try {
    const sendPasswordUpdateEmailResult = await fetch(
      `${process.env.MAIL_SERVICE_BASE_URL}/send-password-update-confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: session?.user.email,
          username: session?.user.name.split(" ")[0],
        }),
      }
    );

    if (!sendPasswordUpdateEmailResult.ok) {
      throw new Error(await sendPasswordUpdateEmailResult.json());
    }
  } catch (error) {
    console.error("[SERVER ACTIONS] Error sending password update email:", error);
  }

  return {
    success: true,
    ...submittedFormData,
  };
}
