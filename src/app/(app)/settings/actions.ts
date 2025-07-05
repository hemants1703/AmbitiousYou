import { createClient } from "@/src/utils/supabase/client";
import chalk from "chalk";

export default async function updateProfileAction(userId: string | undefined, firstName: string | undefined, lastName: string | undefined) {
    if (!userId) {
        return {
            success: false,
            error: "User ID is required"
        }
    }

    if (!firstName && !lastName) {
        return {
            success: false,
            error: "At least one field (firstName or lastName) is required"
        }
    }

    const supabase = createClient();

    const { data, error, status, statusText } = await supabase
        .from("profiles")
        .update({ firstName, lastName })
        .eq("userId", userId);

    if (error) {
        console.error("Error updating profile: ", error);
        return {
            success: false,
            error: error.message
        }
    }

    console.log(chalk.bgGreenBright("[SERVER ACTIONS] Profile updated successfully: "), userId, status, statusText, data);


    return {
        success: true,
        data: data,
    }
}