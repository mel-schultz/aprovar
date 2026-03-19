import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ReportData {
  projectsByStatus: Array<{ status: string; count: number }>;
  tasksByPriority: Array<{ priority: string; count: number }>;
  tasksByStatus: Array<{ status: string; count: number }>;
  monthlyActivity: Array<{ month: string; projects: number; tasks: number }>;
}

export default function Reports() {
  const [reportData, setReportData] = useState<ReportData>({
    projectsByStatus: [],
    tasksByPriority: [],
    tasksByStatus: [],
    monthlyActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch projects by status
      const { data: projects } = await supabase
        .from("projects")
        .select("status");

      const projectsByStatus = [
        {
          status: "Planejamento",
          count: projects?.filter((p) => p.status === "planejamento").length || 0,
        },
        {
          status: "Produção",
          count: projects?.filter((p) => p.status === "producao").length || 0,
        },
        {
          status: "Aprovação",
          count: projects?.filter((p) => p.status === "aprovacao").length || 0,
        },
        {
          status: "Publicado",
          count: projects?.filter((p) => p.status === "publicado").length || 0,
        },
        {
          status: "Arquivado",
          count: projects?.filter((p) => p.status === "arquivado").length || 0,
        },
      ];

      // Fetch tasks by priority
      const { data: tasksPriority } = await supabase
        .from("tasks")
        .select("priority");

      const tasksByPriority = [
        {
          priority: "Baixa",
          count: tasksPriority?.filter((t: any) => t.priority === "baixa").length || 0,
        },
        {
          priority: "Média",
          count: tasksPriority?.filter((t: any) => t.priority === "media").length || 0,
        },
        {
          priority: "Alta",
          count: tasksPriority?.filter((t: any) => t.priority === "alta").length || 0,
        },
        {
          priority: "Urgente",
          count: tasksPriority?.filter((t: any) => t.priority === "urgente").length || 0,
        },
      ];

      // Fetch tasks by status
      const { data: tasksStatus } = await supabase
        .from("tasks")
        .select("status");

      const tasksByStatus = [
        {
          status: "Pendente",
          count: tasksStatus?.filter((t: any) => t.status === "pendente").length || 0,
        },
        {
          status: "Em Progresso",
          count: tasksStatus?.filter((t: any) => t.status === "em_progresso").length || 0,
        },
        {
          status: "Revisão",
          count: tasksStatus?.filter((t: any) => t.status === "revisao").length || 0,
        },
        {
          status: "Concluída",
          count: tasksStatus?.filter((t: any) => t.status === "concluida").length || 0,
        },
      ];

      // Mock monthly activity data
      const monthlyActivity = [
        { month: "Jan", projects: 4, tasks: 24 },
        { month: "Fev", projects: 3, tasks: 13 },
        { month: "Mar", projects: 2, tasks: 9 },
        { month: "Abr", projects: 5, tasks: 39 },
        { month: "Mai", projects: 4, tasks: 28 },
        { month: "Jun", projects: 6, tasks: 40 },
      ] as Array<{ month: string; projects: number; tasks: number }>;

      setReportData({
        projectsByStatus,
        tasksByPriority,
        tasksByStatus,
        monthlyActivity,
      });
    } catch (error) {
      toast.error("Erro ao carregar relatórios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const handleExportPDF = () => {
    toast.success("Exportação de PDF em desenvolvimento");
  };

  const handleExportCSV = () => {
    toast.success("Exportação de CSV em desenvolvimento");
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Análise de desempenho e atividades
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.projectsByStatus.reduce((sum, item) => sum + item.count, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.tasksByStatus.reduce((sum, item) => sum + item.count, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.tasksByStatus.find((t) => t.status === "Concluída")?.count || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  ((reportData.tasksByStatus.find((t) => t.status === "Concluída")?.count || 0) /
                    (reportData.tasksByStatus.reduce((sum, item) => sum + item.count, 0) || 1)) *
                    100
                )}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Projetos por Status</CardTitle>
              <CardDescription>
                Distribuição de projetos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.projectsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tasks by Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Tarefas por Prioridade</CardTitle>
              <CardDescription>
                Distribuição de prioridades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.tasksByPriority}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {reportData.tasksByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tasks by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Tarefas por Status</CardTitle>
              <CardDescription>
                Progresso das tarefas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.tasksByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Mensal</CardTitle>
              <CardDescription>
                Projetos e tarefas por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="projects" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="tasks" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Status</CardTitle>
            <CardDescription>
              Visão geral de todos os status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Projetos</h4>
                <div className="space-y-2">
                  {reportData.projectsByStatus.map((item) => (
                    <div key={item.status} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{item.status}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Tarefas</h4>
                <div className="space-y-2">
                  {reportData.tasksByStatus.map((item) => (
                    <div key={item.status} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{item.status}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
