"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      {Icon && (
        <div className="mx-auto mb-4 w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
          <Icon size={28} className="text-brand" />
        </div>
      )}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 text-sm mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}
