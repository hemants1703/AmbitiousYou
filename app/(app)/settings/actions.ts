import { createClient } from "@/utils/supabase/client";

export default async function deleteAccountAction(userId: string | undefined) {
    if (!userId) {
        return {
            success: false,
            error: "User ID is required"
        }
    }

    console.log("Deleting user with ID: ", userId);

    const supabase = createClient();

    const { data, error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
        console.error("Error deleting user: ", error);
        return {
            success: false,
            error: error.message
        }
    }

    return {
        success: true,
        data: data,
    }
}