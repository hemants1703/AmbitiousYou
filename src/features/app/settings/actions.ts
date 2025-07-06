"use server";

import { createClient } from "@/src/utils/supabase/server";
import chalk from "chalk";
import { revalidatePath } from "next/cache";

export default async function updateProfileAction(userId: string, firstName: string, lastName: string): Promise<{
    success: boolean;
    error?: string;
    data?: null;
}> {
    if (!userId) {
        return {
            success: false,
            error: "User ID is required"
        }
    }

    if (!firstName || !lastName) {
        return {
            success: false,
            error: "Both first name and last name are required to update profile"
        }
    } else if (firstName.length < 2 || lastName.length < 2) {
        return {
            success: false,
            error: "First name and last name must be at least 2 characters long"
        }
    }

    const supabase = await createClient();

    const { data, error, status, statusText } = await supabase
        .from("profiles")
        .update({ firstName, lastName, updatedAt: new Date() })
        .eq("userId", userId);

    if (error) {
        console.error("[SERVER ACTIONS] Error updating profile: ", error);
        return {
            success: false,
            error: error.message
        }
    }

    console.log(chalk.bgGreenBright("[SERVER ACTIONS] Profile updated successfully: "), userId, status, statusText, data);

    revalidatePath("/settings", "page");
    return {
        success: true,
        data: data,
    }
}