import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";

/**
 * Login Page - Primer CSS Design
 * 
 * Design Philosophy:
 * - Clean, minimal layout with professional appearance
 * - Clear visual hierarchy with GitHub-inspired styling
 * - Accessible form inputs with proper focus states
 * - Responsive design for mobile and desktop
 * - Subtle animations for smooth interactions
 */

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@test.com" && password === "teste123456") {
        // Redirect to dashboard
        setLocation("/dashboard");
      } else {
        setError("Email ou senha inválidos");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <span className="text-white font-bold text-lg">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AprovaAí</h1>
          <p className="text-gray-600 text-sm">Sistema de Aprovações de Entregáveis</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors duration-200"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-gray-50 rounded border border-gray-200 p-4 text-sm">
            <p className="font-medium text-gray-900 mb-2">Teste com as contas de demo:</p>
            <div className="space-y-2 text-gray-700">
              <div>
                <span className="font-medium">Admin:</span> admin@test.com / teste123456
              </div>
              <div>
                <span className="font-medium">Novo usuário:</span> Crie uma conta com qualquer email
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>© 2024 AprovaAí. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
