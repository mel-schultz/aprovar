"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, isLoadingSet] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Se está logado, redirecionar para dashboard
        if (session?.user) {
          router.push("/dashboard");
          return;
        }

        isLoadingSet(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        isLoadingSet(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <LoginForm />
    </div>
  );
}
