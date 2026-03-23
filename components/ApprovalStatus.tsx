/**
 * Exemplo: Componente de status de aprovação usando Phosphor Icons
 * Demonstra uso em Client Component com diferentes pesos de ícone
 */

"use client";

import {
  CheckCircle as IconApproved,
  XCircle as IconRejected,
  Clock as IconPending,
  WarningCircle as IconWarning,
} from "@phosphor-icons/react";

type Status = "approved" | "rejected" | "pending" | "review";

interface ApprovalStatusProps {
  status: Status;
  label?: string;
}

const statusConfig: Record<
  Status,
  { Icon: React.ElementType; color: string; defaultLabel: string }
> = {
  approved: {
    Icon: IconApproved,
    color: "#22c55e",
    defaultLabel: "Aprovado",
  },
  rejected: {
    Icon: IconRejected,
    color: "#ef4444",
    defaultLabel: "Reprovado",
  },
  pending: {
    Icon: IconPending,
    color: "#f59e0b",
    defaultLabel: "Pendente",
  },
  review: {
    Icon: IconWarning,
    color: "#3b82f6",
    defaultLabel: "Em revisão",
  },
};

export function ApprovalStatus({ status, label }: ApprovalStatusProps) {
  const { Icon, color, defaultLabel } = statusConfig[status];

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <Icon size={18} color={color} weight="fill" />
      <span>{label ?? defaultLabel}</span>
    </span>
  );
}
