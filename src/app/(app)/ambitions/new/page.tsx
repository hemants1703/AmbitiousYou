import { redirect } from "next/navigation";
import { NewAmbitionClient } from "@/src/features/app/ambitions/new/NewAmbitionClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Ambition | AmbitiousYou",
};

export default async function NewAmbitionPage() {
  // TODO: Implement proper authentication check with BetterAuth
  // For now, allowing access without authentication

  return <NewAmbitionClient />;
}
