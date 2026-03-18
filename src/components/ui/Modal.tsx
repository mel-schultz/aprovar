"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width = 520,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-y-auto p-7"
        style={{ maxWidth: width }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="bg-slate-100 border-none rounded-lg p-1.5 cursor-pointer flex"
          >
            <X size={16} className="text-slate-600" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
