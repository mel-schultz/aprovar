"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Profile, TeamMember, ROLE_PERMISSIONS } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  teamMember: TeamMember | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: Profile | null; error: any }>;
  fetchProfile: (userId: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canManageUsers: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchTeamMember(session.user.id);
      } else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchTeamMember(session.user.id);
      } else {
        setProfile(null);
        setTeamMember(null);
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  }

  async function fetchTeamMember(userId: string) {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .eq("user_id", userId)
      .single();
    setTeamMember(data);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function updateProfile(updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user!.id)
      .select()
      .single();
    if (!error) setProfile(data);
    return { data, error };
  }

  function hasPermission(permission: string): boolean {
    if (!profile) return false;
    const permissions = ROLE_PERMISSIONS[profile.role];
    return permissions?.[permission] ?? false;
  }

  function canManageUsers(): boolean {
    return profile?.role === "admin" || teamMember?.can_manage_team === true;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        teamMember,
        loading,
        signOut,
        updateProfile,
        fetchProfile,
        hasPermission,
        canManageUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
