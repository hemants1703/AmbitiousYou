"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import { ProfilesService } from "@/src/services/profilesService";
import { AmbitionsService } from "@/src/services/ambitionsService";
import { toast } from "sonner";
import { User, Profile, Ambition } from "@/types/globals";

type AuthContextType = {
  user: User | null;
  profileData: Profile | null;
  ambitionsData: Ambition[] | null;
  loading: boolean;
  profileLoading: boolean;
  ambitionsLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profileData: null,
  ambitionsData: null,
  loading: true,
  profileLoading: false,
  ambitionsLoading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [ambitionsData, setAmbitionsData] = useState<Ambition[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [ambitionsLoading, setAmbitionsLoading] = useState(false);

  // Initialize auth session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authClient.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fetch user data when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setProfileData(null);
        setAmbitionsData(null);
        return;
      }

      setProfileLoading(true);
      setAmbitionsLoading(true);

      try {
        const [profileResult, ambitionsResult] = await Promise.all([
          ProfilesService.fetchUserProfile(user.id),
          AmbitionsService.fetchActiveAmbitions(user.id),
        ]);

        setProfileData(profileResult);
        setAmbitionsData(ambitionsResult);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error", { description: "Failed to load user data" });
        setProfileData(null);
        setAmbitionsData(null);
      } finally {
        setProfileLoading(false);
        setAmbitionsLoading(false);
      }
    };

    if (!loading) {
      fetchUserData();
    }
  }, [user, loading]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        throw result.error;
      }
      setUser(result.data?.user || null);
      toast.success("Signed in successfully");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Sign in failed", { description: "Invalid credentials" });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (result.error) {
        throw result.error;
      }
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Sign up failed", { description: "Please try again" });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setProfileData(null);
      setAmbitionsData(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Sign out failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profileData,
        ambitionsData,
        loading,
        profileLoading,
        ambitionsLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
