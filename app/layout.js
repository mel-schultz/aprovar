"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import AppLayout from "../components/layout/AppLayout";

export default function RootLayout({ children }) {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      try {
        // Pegar usuário autenticado
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        console.log("🔐 Auth User:", authUser?.email);

        if (authError || !authUser) {
          console.log("❌ Usuário não autenticado");
          if (mounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setUser(authUser);
        }

        // Pegar profile do banco
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        console.log("👤 Profile DB:", profileData);
        console.log("⚠️ Profile Error:", profileError);

        if (profileData && !profileError) {
          if (mounted) {
            setProfile(profileData);
            console.log("✅ Profile carregado com sucesso:", profileData);
          }
        } else {
          if (mounted) {
            setProfile(null);
            console.log("⚠️ Profile não encontrado no banco");
          }
        }
      } catch (error) {
        console.error("🔴 Erro ao buscar profile:", error);
        if (mounted) {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getSession();

    // Cleanup
    return () => {
      mounted = false;
    };
  }, [supabase]);

  // Se está carregando, mostrar tela de carregamento
  if (loading) {
    return (
      <html>
        <body style={{ margin: 0, padding: 20 }}>
          <div style={{ textAlign: "center" }}>Carregando...</div>
        </body>
      </html>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!user) {
    return (
      <html>
        <body style={{ margin: 0, padding: 20 }}>
          <div style={{ textAlign: "center" }}>
            Redirecionando para login...
          </div>
        </body>
      </html>
    );
  }

  // Renderizar com AppLayout
  return (
    <html>
      <body style={{ margin: 0, padding: 0 }}>
        <AppLayout profile={profile}>{children}</AppLayout>
      </body>
    </html>
  );
}
