"use client";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "revision";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const map = {
    pending: { label: "Pendente", className: "bg-amber-100 text-amber-900" },
    approved: { label: "Aprovado", className: "bg-green-100 text-green-900" },
    rejected: { label: "Recusado", className: "bg-red-100 text-red-900" },
    revision: { label: "Em revisão", className: "bg-purple-100 text-purple-900" },
  };

  const { label, className } = map[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
