"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui";

export default function TeamPage() {
  return (
    <AppLayout>
      <div className="page-enter">
        <div className="mb-7">
          <h1 className="text-3xl font-bold mb-1">Equipe</h1>
          <p className="text-slate-600 text-base">
            Adicione membros para colaborar com seus projetos.
          </p>
        </div>

        <Card className="p-10 text-center">
          <p className="text-slate-600">
            Página de equipe em desenvolvimento...
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
