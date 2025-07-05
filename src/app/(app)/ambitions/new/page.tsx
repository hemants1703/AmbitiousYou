import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import { NewAmbitionClient } from "./NewAmbitionClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Ambition | AmbitiousYou",
};

export default async function NewAmbitionPage() {
  const supabase = await createClient();

  const { error: userDoesNotExist } = await supabase.auth.getUser();

  // Check if the user is logged in
  if (userDoesNotExist) {
    redirect("/login");
  }

  return <NewAmbitionClient />;
}
