import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [, setLocation] = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        // Create profile
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            role: "designer", // Default role for new users
          });
        }

        toast.success("Cadastro realizado! Verifique seu email para confirmar.");
        setIsSignUp(false);
        setEmail("");
        setPassword("");
        setFullName("");
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Login realizado com sucesso!");
        setLocation("/dashboard");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro na autenticação"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">e</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {isSignUp ? "Criar Conta" : "eKyte Clone"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp
              ? "Preencha os dados para se cadastrar"
              : "Sistema de Gestão de Marketing Digital"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-sm font-medium text-foreground">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isSignUp}
                  disabled={loading}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? "Cadastrar" : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Já tem conta?" : "Não tem conta?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline font-medium"
              >
                {isSignUp ? "Entrar" : "Cadastrar"}
              </button>
            </p>
          </div>

          {/* Demo credentials hint */}
          {!isSignUp && (
            <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-xs font-medium text-blue-900 mb-1">
                Credenciais de Demonstração:
              </p>
              <p className="text-xs text-blue-800">
                Email: <code className="bg-white px-1 rounded">admin@ekyte.com</code>
              </p>
              <p className="text-xs text-blue-800">
                Senha: <code className="bg-white px-1 rounded">demo123456</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
