"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui";

export default function SchedulePage() {
  return (
    <AppLayout>
      <div className="page-enter">
        <div className="mb-7">
          <h1 className="text-3xl font-bold mb-1">Calendário de publicações</h1>
          <p className="text-slate-600 text-base">
            Visualize e gerencie seus agendamentos.
          </p>
        </div>

        <Card className="p-10 text-center">
          <p className="text-slate-600">
            Página de calendário em desenvolvimento...
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
