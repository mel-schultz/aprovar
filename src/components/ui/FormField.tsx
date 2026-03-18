"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
