import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { FolderOpen, CheckSquare, Users, TrendingUp } from "lucide-react";
import { Loader2 } from "lucide-react";

interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  totalUsers: number;
  completedTasks: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalTasks: 0,
    totalUsers: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch projects count
        const { count: projectsCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true });

        // Fetch tasks count
        const { count: tasksCount } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true });

        // Fetch completed tasks count
        const { count: completedCount } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", "concluida");

        // Fetch users count
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        setStats({
          totalProjects: projectsCount || 0,
          totalTasks: tasksCount || 0,
          totalUsers: usersCount || 0,
          completedTasks: completedCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "Jan", projetos: 4, tarefas: 24 },
    { name: "Fev", projetos: 3, tarefas: 13 },
    { name: "Mar", projetos: 2, tarefas: 9 },
    { name: "Abr", projetos: 5, tarefas: 39 },
    { name: "Mai", projetos: 4, tarefas: 28 },
    { name: "Jun", projetos: 6, tarefas: 40 },
  ];

  const performanceData = [
    { name: "Semana 1", performance: 65 },
    { name: "Semana 2", performance: 78 },
    { name: "Semana 3", performance: 72 },
    { name: "Semana 4", performance: 85 },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {user?.full_name}!
          </h1>
          <p className="text-blue-100">
            Acompanhe o progresso dos seus projetos e tarefas em tempo real
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos</CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                Projetos ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedTasks} concluídas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipe</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Membros da equipe
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalTasks > 0
                  ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Taxa de conclusão
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Mensal</CardTitle>
              <CardDescription>
                Projetos e tarefas por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="projetos" fill="#3b82f6" />
                  <Bar dataKey="tarefas" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Semanal</CardTitle>
              <CardDescription>
                Taxa de conclusão de tarefas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo projeto criado</p>
                  <p className="text-xs text-muted-foreground">
                    Campanha de Marketing Digital
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Agora</span>
              </div>

              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Tarefa concluída</p>
                  <p className="text-xs text-muted-foreground">
                    Design de banner para redes sociais
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">2h atrás</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Aprovação pendente</p>
                  <p className="text-xs text-muted-foreground">
                    Revisão de conteúdo aguardando
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">5h atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
