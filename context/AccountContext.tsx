import { SupabaseProfileData, AmbitionsData } from "@/types";
import { User } from "@supabase/supabase-js";
import { createContext } from "react";

export type AccountDataContextType = {
  user: User | null;
  profileData: SupabaseProfileData[] | null;
  ambitionsData: AmbitionsData[] | null;
} | null;

export const AccountContext = createContext<AccountDataContextType>(null);
