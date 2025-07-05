import { SupabaseProfileData, AmbitionData } from "@/src/types";
import { User } from "@supabase/supabase-js";
import { createContext } from "react";

export type AccountDataContextType = {
  user: User | null;
  profileData: SupabaseProfileData[] | null;
  ambitionsData: AmbitionData[] | null;
} | null;

export const AccountContext = createContext<AccountDataContextType>(null);
