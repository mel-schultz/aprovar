/**
 * Exemplo: Badge de status de aprovação com ícones Phosphor
 */

"use client";

import {
  CheckCircle,
  XCircle,
  Clock,
  WarningCircle,
} from "@phosphor-icons/react";

type Status = "approved" | "rejected" | "pending" | "review";

interface ApprovalStatusProps {
  status: Status;
  label?: string;
}

const config: Record<Status, { Icon: React.ElementType; color: string; label: string }> = {
  approved: { Icon: CheckCircle,    color: "#22c55e", label: "Aprovado"  },
  rejected: { Icon: XCircle,        color: "#ef4444", label: "Reprovado" },
  pending:  { Icon: Clock,          color: "#f59e0b", label: "Pendente"  },
  review:   { Icon: WarningCircle,  color: "#3b82f6", label: "Em revisão"},
};

export function ApprovalStatus({ status, label }: ApprovalStatusProps) {
  const { Icon, color, label: defaultLabel } = config[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <Icon size={18} color={color} weight="fill" />
      <span>{label ?? defaultLabel}</span>
    </span>
  );
}
