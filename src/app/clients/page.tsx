"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui";

export default function ClientsPage() {
  return (
    <AppLayout>
      <div className="page-enter">
        <div className="mb-7">
          <h1 className="text-3xl font-bold mb-1">Clientes</h1>
          <p className="text-slate-600 text-base">
            Gerencie seus clientes e aprovadores.
          </p>
        </div>

        <Card className="p-10 text-center">
          <p className="text-slate-600">
            Página de clientes em desenvolvimento...
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
