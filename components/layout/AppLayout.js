"use client";

import { createClient } from "./lib/supabase/client";
import AppLayout from "./components/layout/AppLayout";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!error && data) {
            setProfile(data);
            console.log("✅ Profile carregado:", data);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <html>
      <body>
        <AppLayout profile={profile}>{children}</AppLayout>
      </body>
    </html>
  );
}
