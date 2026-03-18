"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button, FormField } from "@/components/ui";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    company: "",
  });

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name, company: form.company },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail.");
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center">
              <CheckSquare size={22} className="text-white" />
            </div>
            <span className="font-bold text-3xl text-brand">
              Aprova<span className="text-slate-900">Aí</span>
            </span>
          </div>
          <p className="text-slate-600 text-sm">
            Plataforma de aprovações e agendamento de conteúdo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-9 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-1">
            {mode === "login" ? "Entrar na conta" : "Criar conta grátis"}
          </h2>
          <p className="text-slate-600 text-sm mb-7">
            {mode === "login"
              ? "Bem-vindo de volta!"
              : "7 dias grátis, sem cartão de crédito."}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <FormField label="Seu nome">
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="João Silva"
                    required
                  />
                </FormField>
                <FormField label="Empresa / Agência">
                  <input
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="Minha Agência"
                  />
                </FormField>
              </>
            )}
            <FormField label="E-mail">
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="voce@empresa.com"
                required
              />
            </FormField>
            <FormField label="Senha">
              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </FormField>

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center py-3 text-base mt-1"
            >
              {mode === "login" ? "Entrar" : "Começar teste grátis"}
            </Button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-600">
            {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
            <button
              onClick={() =>
                setMode((m) => (m === "login" ? "signup" : "login"))
              }
              className="text-brand font-semibold bg-none border-none cursor-pointer text-sm"
            >
              {mode === "login" ? "Criar grátis" : "Entrar"}
            </button>
          </p>
        </div>
      </div>

      {/* Right panel — hero */}
      <div className="hidden lg:flex flex-1 bg-brand flex-col items-center justify-center p-16 text-white">
        <div className="max-w-sm">
          <h1 className="text-4xl leading-tight mb-5">
            Chega de caos nas aprovações de conteúdo
          </h1>
          <p className="text-base opacity-85 leading-relaxed mb-9">
            Envie, aprove e agende posts em um só lugar. Seus clientes aprovam
            com um clique — você publica no piloto automático.
          </p>
          {[
            "67% menos pedidos de refação",
            "75% menos reuniões de aprovação",
            "29% menos contratos perdidos",
          ].map((stat) => (
            <div key={stat} className="flex items-center gap-3 mb-3.5">
              <div className="w-6 h-6 bg-white/25 rounded flex items-center justify-center flex-shrink-0">
                <CheckSquare size={14} className="text-white" />
              </div>
              <span className="text-base opacity-90">{stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
