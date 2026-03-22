"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#fafafa",
      }}
    >
      {/* Lado esquerdo - Login */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#0ea472",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                }}
              >
                ✓
              </div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  margin: 0,
                  color: "#0ea472",
                }}
              >
                Aprovar
              </h1>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                margin: 0,
              }}
            >
              Plataforma de aprovações e agendamento de conteúdo
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#1a1a1a",
              }}
            >
              Entrar na conta
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "24px",
              }}
            >
              Bem-vindo de volta!
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#1a1a1a",
                  }}
                >
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#1a1a1a",
                  }}
                >
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                  }}
                  required
                />
              </div>

              {error && (
                <div
                  style={{
                    background: "#fee",
                    color: "#c33",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#0ea472",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginTop: "16px",
                textAlign: "center",
              }}
            >
              Não tem conta?{" "}
              <a
                href="/signup"
                style={{
                  color: "#0ea472",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Criar agora
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito - Banner */}
      <div
        style={{
          flex: 1,
          background: "#0ea472",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "40px",
              fontWeight: "700",
              marginBottom: "20px",
              lineHeight: "1.2",
            }}
          >
            Chega de caos nas aprovações de conteúdo
          </h2>
          <p
            style={{
              fontSize: "18px",
              marginBottom: "40px",
              opacity: 0.9,
              lineHeight: "1.6",
            }}
          >
            Envie, aprove e agende posts em um só lugar. Seus clientes aprovam
            com um clique.
          </p>
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>✓</span>
              <span>67% menos pedidos de refação</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>✓</span>
              <span>75% menos reuniões de aprovação</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>✓</span>
              <span>29% menos contratos perdidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
