"use server";

import { createClient } from "@/src/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function favouriteAmbitionAction(userId: string, ambitionId: string, favouriteValue: boolean) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("ambitions")
        .update({ isFavourited: favouriteValue })
        .eq("id", ambitionId)
        .eq("userId", userId)
        .select()

    if (error) {
        console.error("Error updating ambition:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/ambitions")

    const message = favouriteValue ? "Ambition added to favorites" : "Ambition removed from favorites";
    const description = favouriteValue ? "You can now find this ambition in your favourites tab" : "";

    return { success: true, message, description };
}