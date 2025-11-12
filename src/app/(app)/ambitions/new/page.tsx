import CreateNewAmbitionForm from "@/features/(app)/ambitions/CreateNewAmbition/CreateNewAmbitionForm";
import confirmSession from "@/lib/auth/confirmSession";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Create New Ambition | AmbitiousYou",
};

export default async function NewAmbitionPage() {
  const session = await confirmSession();

  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  return <CreateNewAmbitionForm />;
}
