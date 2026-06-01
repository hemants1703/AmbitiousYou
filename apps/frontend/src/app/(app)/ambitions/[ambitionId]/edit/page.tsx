import { AmbitionDetails, getAmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { getUser } from "@/lib/api/sidebar/get-user";
import { getSessionToken } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";

interface EditAmbitionPageProps {
  params: Promise<{ ambitionId: string }>;
}

const getAmbitionData = cache(async (sessionToken: string, ambitionId: string): Promise<AmbitionDetails | null> => {
  return await getAmbitionDetails(sessionToken, ambitionId);
});

export default async function EditAmbitionPage(props: EditAmbitionPageProps) {
  const sessionToken = await getSessionToken();
  const userDetails = await getUser(sessionToken);

  if (!userDetails) {
    return redirect("/login", RedirectType.replace);
  }

  const ambitionData = await getAmbitionData(sessionToken, (await props.params).ambitionId);
  if (!ambitionData) {
    throw new Error("Failed to fetch ambition details");
  }

  return <div>Edit ambition page for ambition {ambitionData.ambitionName}</div>;
}
