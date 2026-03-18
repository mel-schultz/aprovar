"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 font-medium cursor-pointer border-none rounded-lg transition-all whitespace-nowrap";

  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary: "bg-slate-100 text-slate-900 border border-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    outline: "bg-transparent text-brand border border-brand",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        loading && "opacity-60",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
