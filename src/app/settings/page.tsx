"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="page-enter max-w-2xl">
        <div className="mb-7">
          <h1 className="text-3xl font-bold mb-1">Configurações</h1>
          <p className="text-slate-600 text-base">
            Personalize sua conta e marca.
          </p>
        </div>

        <Card className="p-10 text-center">
          <p className="text-slate-600">
            Página de configurações em desenvolvimento...
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
