import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NewAmbitionClient } from "./NewAmbitionClient";
import { User } from "@supabase/supabase-js";
import { getPlansTableData } from "@/utils/supabase/tablesDataProvider";
import type { SupabasePlansData } from "@/types";

export default async function NewAmbitionPage() {
  const supabase = await createClient();

  const { data, error: userDoesNotExist } = await supabase.auth.getUser();

  // Check if the user is logged in
  if (userDoesNotExist) {
    redirect("/login");
  }

  const userData: User = data.user;
  const { id } = userData;

  const plansData: SupabasePlansData[] = await getPlansTableData(id);

  return <NewAmbitionClient plansData={plansData}  />;
}
