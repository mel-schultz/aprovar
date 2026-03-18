"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback,
}: ProtectedRouteProps) {
  const { user, profile, loading, hasPermission } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    router.push("/login");
    return null;
  }

  // Verificar role necessária
  if (requiredRole && profile.role !== requiredRole) {
    if (fallback) return fallback;
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Acesso Negado</h2>
          <p className="text-slate-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  // Verificar permissão específica
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) return fallback;
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Permissão Insuficiente</h2>
          <p className="text-slate-600">Você não tem permissão para realizar esta ação.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
