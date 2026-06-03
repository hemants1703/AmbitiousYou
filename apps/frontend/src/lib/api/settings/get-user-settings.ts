import { Settings } from "@ambitiousyou/shared";

export async function getUserSettings(sessionToken: string): Promise<Settings | null> {
    const response = await fetch(`${process.env.API_URL}/settings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
        },
    });

    if (!response.ok) {
        return null;
    }

    return await response.json() as Settings;
}