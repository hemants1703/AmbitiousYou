"use server";

import { getSessionToken } from "@/lib/auth";
import { Settings } from "@ambitiousyou/shared";

export async function togglePushAmbitionRemindersSetting(updatedValue: boolean): Promise<Settings> {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
        throw new Error("User is not authenticated");
    }

    const response = await fetch(`${process.env.API_URL}/settings`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ pushAmbitionReminders: updatedValue }),
    });

    if (!response.ok) {
        throw new Error(`(${response.status}) ${response.statusText}`);
    }

    return await response.json() as Settings;
}