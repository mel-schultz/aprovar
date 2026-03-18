"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, StatusBadge } from "@/components/ui";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppLayout } from "@/components/layout/AppLayout";

function StatCard({
  icon: Icon,
  label,
  value,
  color = "text-brand",
  sub,
}: {
  icon: any;
  label: string;
  value: number;
  color?: string;
  sub?: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-600 mb-2">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-2xl bg-opacity-10 flex items-center justify-center ${color}`}>
          <Icon size={22} className={color} />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    clients: 0,
    pending: 0,
    approved: 0,
    scheduled: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [
        { count: clients },
        { count: pending },
        { count: approved },
        { count: scheduled },
        { data: recentData },
      ] = await Promise.all([
        supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", user.id),
        supabase
          .from("deliverables")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", user.id)
          .eq("status", "pending"),
        supabase
          .from("deliverables")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", user.id)
          .eq("status", "approved"),
        supabase
          .from("deliverables")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", user.id)
          .not("scheduled_at", "is", null),
        supabase
          .from("deliverables")
          .select("id,title,status,created_at,clients(name)")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false })
          .limit(6),
      ]);
      setStats({
        clients: clients || 0,
        pending: pending || 0,
        approved: approved || 0,
        scheduled: scheduled || 0,
      });
      setRecent(recentData || []);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <AppLayout>
      <div className="page-enter">
        <div className="bg-amber-100 rounded-xl p-3 mb-6 flex items-center gap-3">
          <AlertCircle size={18} className="text-amber-900" />
          <span className="text-sm text-amber-900 font-medium">
            Plano de teste: para continuar após os 7 dias.
          </span>
        </div>

        <div className="mb-7">
          <h1 className="text-3xl font-bold mb-1">
            Olá, {profile?.full_name?.split(" ")[0] || "bem-vindo"}!
          </h1>
          <p className="text-slate-600 text-base">
            Aqui está o resumo das suas aprovações.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <StatCard icon={Users} label="Clientes ativos" value={stats.clients} />
          <StatCard
            icon={Clock}
            label="Aguardando aprovação"
            value={stats.pending}
            color="text-amber-500"
          />
          <StatCard
            icon={CheckSquare}
            label="Aprovados"
            value={stats.approved}
            color="text-brand"
          />
          <StatCard
            icon={TrendingUp}
            label="Agendados"
            value={stats.scheduled}
            color="text-purple-500"
          />
        </div>

        {/* Recent deliverables */}
        <Card>
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-semibold">Entregáveis recentes</h2>
            <Link
              href="/approvals"
              className="flex items-center gap-1 text-brand text-xs font-medium"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Carregando...
            </div>
          ) : recent.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-600 text-sm mb-2">
                Nenhum entregável ainda.
              </p>
              <Link
                href="/approvals"
                className="text-brand font-semibold text-sm inline-block mt-2"
              >
                Criar primeiro entregável →
              </Link>
            </div>
          ) : (
            <div>
              {recent.map((d, i) => (
                <div
                  key={d.id}
                  className={`flex items-center justify-between p-3.5 ${
                    i < recent.length - 1
                      ? "border-b border-slate-200"
                      : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium mb-0.5">{d.title}</p>
                    <p className="text-xs text-slate-500">
                      {d.clients?.name} ·{" "}
                      {formatDistanceToNow(new Date(d.created_at), {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
