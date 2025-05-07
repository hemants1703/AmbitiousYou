"use server";

import { createClient } from "./server";

// This function fetches data from the "profiles" table in Supabase
export async function getProfilesTableData(userId: string | null) {
    if (userId === null) {
        console.error("User ID is null. Cannot fetch profiles.");
        return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("userId", userId)

    // console.log("Fetched profiles data: ", data);

    if (error) {
        console.error("Error fetching profiles:", error);
        return [];
    }

    return data;
}

export async function getPlansTableData(userId: string | null) {
    if (userId === null) {
        console.error("User ID is null. Cannot fetch plans.");
        return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("plans")
        .select()
        .eq("userId", userId)

    if (error) {
        console.error("Error fetching plans:", error);
        return [];
    }

    return data;
}

// This function fetches data from the "ambitions" table in Supabase
export async function getAmbitionsTableData(userId: string | null) {
    if (userId === null) {
        console.error("User ID is null. Cannot fetch ambitions.");
        return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("ambitions")
        .select()
        .eq("userId", userId)

    if (error) {
        console.error("Error fetching ambitions:", error);
        return [];
    }

    return data;
}