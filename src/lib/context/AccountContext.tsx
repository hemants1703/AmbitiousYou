import { Profile, Ambition } from "@/src/types";
import { User } from "@supabase/supabase-js";
import { createContext } from "react";

export type AccountDataContextType = {
  user: User | null;
  profileData: Profile[] | null;
  ambitionsData: Ambition[] | null;
} | null;

export const AccountContext = createContext<AccountDataContextType>(null);
