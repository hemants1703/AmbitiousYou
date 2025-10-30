"use server";

import { revalidatePath } from "next/cache";
import { AmbitionsService } from "@/src/services/ambitionsService";

export async function favouriteAmbitionAction(userId: string, ambitionId: string, favouriteValue: boolean) {
    try {
        const result = await AmbitionsService.updateAmbition(ambitionId, userId, { isFavourited: favouriteValue });

        if (!result) {
            return { success: false, error: "Failed to update ambition" };
        }

        revalidatePath("/ambitions");

        const message = favouriteValue ? "Ambition added to favorites" : "Ambition removed from favorites";
        const description = favouriteValue ? "You can now find this ambition in your favourites tab" : "";

        return { success: true, message, description };
    } catch (error) {
        console.error("Error updating ambition:", error);
        return { success: false, error: "Failed to update ambition" };
    }
}