"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = "", style }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-slate-200 shadow-sm",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
