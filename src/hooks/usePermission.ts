import { useAuth } from "@/contexts/AuthContext";

export function usePermission() {
  const { profile, hasPermission, canManageUsers } = useAuth();

  return {
    // Verificar role
    isAdmin: profile?.role === "admin",
    isAtendimento: profile?.role === "atendimento",
    isDesigner: profile?.role === "designer",

    // Verificar permissões específicas
    canCreate: hasPermission("can_create"),
    canEdit: hasPermission("can_edit"),
    canDelete: hasPermission("can_delete"),
    canManageTeam: canManageUsers(),
    canViewAnalytics: hasPermission("can_view_analytics"),
    canManageClients: hasPermission("can_manage_clients"),
    canManageDeliverables: hasPermission("can_manage_deliverables"),

    // Função genérica
    has: (permission: string) => hasPermission(permission),
  };
}
