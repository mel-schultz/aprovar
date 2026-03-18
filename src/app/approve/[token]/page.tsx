"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui";

export default function ApprovalPublicPage() {
  const params = useParams();
  const token = params.token as string;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-10 text-center">
          <p className="text-slate-600">
            Página pública de aprovação em desenvolvimento...
          </p>
          <p className="text-xs text-slate-500 mt-4">Token: {token}</p>
        </Card>
      </div>
    </div>
  );
}
