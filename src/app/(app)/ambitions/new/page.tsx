import { NewAmbitionClient } from "@/features/ambitions/new/NewAmbitionClient";
import confirmSession from "@/lib/auth/confirmSession";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Ambition | AmbitiousYou",
};

export default async function NewAmbitionPage() {
  const session = await confirmSession();

  return <NewAmbitionClient />;
}
