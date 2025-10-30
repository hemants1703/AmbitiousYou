import { Profile, Ambition, User } from "@/types/globals";
import { createContext } from "react";

export type AccountDataContextType = {
  user: User | null;
  profileData: Profile[] | null;
  ambitionsData: Ambition[] | null;
} | null;

export const AccountContext = createContext<AccountDataContextType>(null);
