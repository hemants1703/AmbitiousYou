"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import {
  getAmbitionsTableData,
  getProfilesTableData,
} from "@/lib/utils/supabase/tablesDataProvider";
import { toast } from "sonner";
import { Ambition, Profile } from "@/types/globals";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profileData: Profile[] | null;
  ambitionsData: Ambition[] | null;
  loading: boolean; // Combined loading state
  profileLoading: boolean; // Specific state for profile fetch
  ambitionsLoading: boolean; // Specific state for ambitions fetch
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profileData: null,
  ambitionsData: null,
  loading: true,
  profileLoading: false,
  ambitionsLoading: false, // Add initial state
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<Profile[] | null>(null);
  const [ambitionsData, setAmbitionsData] = useState<Ambition[] | null>(null);
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [ambitionsLoading, setAmbitionsLoading] = useState<boolean>(false);

  const supabase = createClient();

  // Stable function to fetch profile and ambitions data
  const fetchSupabaseDB = useCallback(async (userId: string) => {
    if (!userId) return;

    console.log(`[AuthProvider] Attempting to fetch data for user: ${userId}`);
    setProfileLoading(true);
    setAmbitionsLoading(true);
    setProfileData(null);
    setAmbitionsData(null);

    try {
      // Fetch concurrently
      const [profileResult, ambitionsResult] = await Promise.all([
        getProfilesTableData(userId), // Fetch profiles
        getAmbitionsTableData(userId), // Fetch ambitions (ensure this function exists!)
      ]);

      console.log(`[AuthProvider] Profile data received for ${userId}:`, profileResult);
      console.log(`[AuthProvider] Ambitions data received for ${userId}:`, ambitionsResult);

      // Handle Profile Data
      if (profileResult === null) {
        toast.error("Profile Error", { description: "Could not retrieve profile data." });
        setProfileData(null);
      } else if (profileResult.length === 0) {
        console.warn(`[AuthProvider] No profile found for user ${userId}.`);
        setProfileData([]);
      } else {
        setProfileData(profileResult);
      }

      // Handle Ambitions Data
      if (ambitionsResult === null) {
        toast.error("Ambition Error", { description: "Could not retrieve ambitions data." });
        setAmbitionsData(null);
      } else if (ambitionsResult.length === 0) {
        console.warn(`[AuthProvider] No ambitions found for user ${userId}.`);
        setAmbitionsData([]);
      } else {
        setAmbitionsData(ambitionsResult);
      }
    } catch (error) {
      console.error(`[AuthProvider] Error fetching data for ${userId}:`, error);
      toast.error("Internal Server Error", { description: "Failed to fetch user data." });
      // Set both to null on a general fetch error
      setProfileData(null);
      setAmbitionsData(null);
    } finally {
      setProfileLoading(false);
      setAmbitionsLoading(false);
      console.log(`[AuthProvider] Data fetch finished for ${userId}.`);
    }
    // Add getAmbitionsTableData if it were defined within the component,
    // but since it's imported, it's stable if not recreated on every render.
    // If getProfilesTableData/getAmbitionsTableData were defined inside AuthProvider
    // and depended on state/props, they'd need to be in the dependency array.
    // Assuming they are stable imports, [] is okay.
  }, []);

  // Effect to handle initial session check and auth state changes
  useEffect(() => {
    // console.log("[AuthProvider] Initializing session check and listener.");
    let isMounted = true; // Flag to prevent state updates if unmounted

    // Check initial session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (!isMounted) return;
      // console.log("[AuthProvider] Initial session fetched:", currentSession);
      if (error) {
        console.error("[AuthProvider] Error fetching initial session:", error);
        toast.error("Auth Error", { description: "Failed to check session." });
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setInitialAuthCheckComplete(true); // Mark initial check as done
      // console.log("[AuthProvider] Initial auth check complete.");
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      // console.log("[AuthProvider] Auth state changed:", _event, "New session:", newSession);
      setSession(newSession);
      const newUser = newSession?.user ?? null;
      // Update user state only if it's actually different
      setUser((currentUser) => (currentUser?.id === newUser?.id ? currentUser : newUser));
      setInitialAuthCheckComplete(true); // Ensure this is true even if initial check was fast

      // If user logs out, clear profile data and reset loading states
      if (!newUser) {
        console.log("[AuthProvider] User logged out, clearing data.");
        setProfileData(null);
        setAmbitionsData(null); // Reset ambitions data on logout
        setProfileLoading(false);
        setAmbitionsLoading(false); // Reset ambitions loading on logout
      }
    });

    // Cleanup on unmount
    return () => {
      // console.log("[AuthProvider] Cleaning up auth listener.");
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]); // Re-run if supabase.auth instance changes (unlikely)

  // Effect to fetch profile data *after* initial auth check is complete and user exists
  useEffect(() => {
    // Only fetch if the initial auth check is done AND we have a user ID
    if (initialAuthCheckComplete && user?.id) {
      // console.log(
      //   `[AuthProvider] Auth check complete and user ${user.id} present. Triggering profile fetch.`
      // );
      fetchSupabaseDB(user.id);
    } else if (initialAuthCheckComplete && !user) {
      // If auth check is done but there's no user, ensure profile is null and not loading
      // console.log("[AuthProvider] Auth check complete, no user. Ensuring profile data is null.");
      setProfileData(null);
      setProfileLoading(false);
      setAmbitionsData(null); // Reset ambitions data if no user
      setAmbitionsLoading(false); // Reset ambitions loading if no user
    }
  }, [user, initialAuthCheckComplete, fetchSupabaseDB]); // Dependencies

  // Combined loading state: True until initial auth check is done, OR if profile OR ambitions are currently loading
  const combinedLoading = !initialAuthCheckComplete || profileLoading || ambitionsLoading;

  // console.log("[AuthProvider] Rendering. State:", {
  //   userId: user?.id,
  //   initialAuthCheckComplete,
  //   profileLoading,
  //   combinedLoading,
  //   hasProfileData: !!profileData,
  // });

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profileData,
        ambitionsData,
        loading: combinedLoading, // Use combined loading state
        profileLoading,
        ambitionsLoading, // Provide ambitions loading state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
