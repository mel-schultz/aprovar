import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, FileText, Users, AlertCircle, TrendingUp } from "lucide-react";

/**
 * Dashboard Page - Primer CSS Design
 * 
 * Design Philosophy:
 * - Clean grid layout with card-based components
 * - Clear data visualization with icons and metrics
 * - Professional color scheme with status indicators
 * - Responsive design for all screen sizes
 * - Consistent spacing and typography
 */

export default function Dashboard() {
  // Mock data
  const stats = [
    {
      title: "Aprovações Pendentes",
      value: "12",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Aprovadas",
      value: "48",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Entregáveis",
      value: "156",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Clientes",
      value: "24",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  const recentApprovals = [
    {
      id: 1,
      client: "Acme Corp",
      deliverable: "Logo Design v2",
      status: "approved",
      date: "2024-03-20",
    },
    {
      id: 2,
      client: "Tech Startup",
      deliverable: "Website Mockup",
      status: "pending",
      date: "2024-03-19",
    },
    {
      id: 3,
      client: "Design Agency",
      deliverable: "Brand Guidelines",
      status: "rejected",
      date: "2024-03-18",
    },
    {
      id: 4,
      client: "Marketing Co",
      deliverable: "Social Media Assets",
      status: "approved",
      date: "2024-03-17",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Aprovado" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pendente" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejeitado" },
    };
    const s = statusMap[status] || statusMap.pending;
    return <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AprovaAí</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
          <Button variant="outline" className="text-sm">
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao AprovaAí</h2>
          <p className="text-gray-600">Gerencie suas aprovações de forma eficiente e profissional</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Approvals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Aprovações Recentes</CardTitle>
                <CardDescription>Últimas atividades de aprovação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Entregável</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApprovals.map((approval) => (
                        <tr key={approval.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-gray-900 font-medium">{approval.client}</td>
                          <td className="py-3 px-4 text-gray-600">{approval.deliverable}</td>
                          <td className="py-3 px-4">{getStatusBadge(approval.status)}</td>
                          <td className="py-3 px-4 text-gray-500">{approval.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Nova Aprovação
                </Button>
                <Button variant="outline" className="w-full">
                  Novo Cliente
                </Button>
                <Button variant="outline" className="w-full">
                  Upload Entregável
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900 text-sm">12 aprovações pendentes</p>
                    <p className="text-yellow-700 text-xs mt-1">Revise as solicitações em aberto</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de aprovação</span>
                    <span className="font-semibold text-gray-900">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "80%" }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo médio</span>
                    <span className="font-semibold text-gray-900">2.5 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
