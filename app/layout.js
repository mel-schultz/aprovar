"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import AppLayout from "../components/layout/AppLayout";

export default function RootLayout({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    let authListener = null;

    async function loadProfile(userId) {
      try {
        console.log("📥 Buscando profile para user:", userId);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("❌ Erro ao buscar profile:", profileError);
          if (mounted) {
            setProfile(null);
          }
          return;
        }

        if (profileData) {
          console.log("✅ Profile carregado:", profileData);
          if (mounted) {
            setProfile(profileData);
          }
        } else {
          console.log("⚠️ Profile não encontrado");
          if (mounted) {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("🔴 Erro ao buscar profile:", error);
        if (mounted) {
          setProfile(null);
        }
      }
    }

    async function checkAuth() {
      try {
        // Verificar sessão atual
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("🔐 Sessão:", session?.user?.email || "Nenhuma sessão");

        if (error) {
          console.error("❌ Erro ao obter sessão:", error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user?.id) {
          console.log("✅ Usuário autenticado:", session.user.email);
          await loadProfile(session.user.id);
        } else {
          console.log("⚠️ Sessão não encontrada");
          if (mounted) {
            setProfile(null);
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("🔴 Erro em checkAuth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Verificar autenticação na primeira vez
    checkAuth();

    // Monitorar mudanças de autenticação em tempo real
    authListener = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state changed:", event, session?.user?.email);

      if (session?.user?.id) {
        await loadProfile(session.user.id);
      } else {
        if (mounted) {
          setProfile(null);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [supabase]);

  // Se está carregando, mostrar tela de carregamento
  if (loading) {
    return (
      <html>
        <body style={{ margin: 0, padding: 20, fontFamily: "system-ui" }}>
          <div style={{ textAlign: "center", paddingTop: 50 }}>
            <div style={{ fontSize: 18, color: "#666" }}>Carregando...</div>
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
