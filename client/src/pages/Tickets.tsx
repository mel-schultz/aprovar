import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Trash2, Edit2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "aberto" | "em_atendimento" | "resolvido" | "fechado";
  priority: "baixa" | "media" | "alta" | "urgente";
  client_name: string;
  client_email: string;
  created_at: string;
  updated_at: string;
}

export default function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: "aberto" | "em_atendimento" | "resolvido" | "fechado";
    priority: "baixa" | "media" | "alta" | "urgente";
    client_name: string;
    client_email: string;
  }>({
    title: "",
    description: "",
    status: "aberto",
    priority: "media",
    client_name: "",
    client_email: "",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      toast.error("Erro ao carregar tickets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from("tickets")
          .update({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            priority: formData.priority,
            client_name: formData.client_name,
            client_email: formData.client_email,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Ticket atualizado com sucesso!");
      } else {
        // Create
        const { error } = await supabase.from("tickets").insert({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          client_name: formData.client_name,
          client_email: formData.client_email,
          created_by: user?.id,
        });

        if (error) throw error;
        toast.success("Ticket criado com sucesso!");
      }

      setFormData({
        title: "",
        description: "",
        status: "aberto",
        priority: "media",
        client_name: "",
        client_email: "",
      });
      setEditingId(null);
      setDialogOpen(false);
      fetchTickets();
    } catch (error) {
      toast.error("Erro ao salvar ticket");
      console.error(error);
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setFormData({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      client_name: ticket.client_name,
      client_email: ticket.client_email,
    });
    setEditingId(ticket.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este ticket?")) return;

    try {
      const { error } = await supabase.from("tickets").delete().eq("id", id);

      if (error) throw error;
      toast.success("Ticket deletado com sucesso!");
      fetchTickets();
    } catch (error) {
      toast.error("Erro ao deletar ticket");
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberto":
        return "bg-red-100 text-red-800";
      case "em_atendimento":
        return "bg-blue-100 text-blue-800";
      case "resolvido":
        return "bg-green-100 text-green-800";
      case "fechado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "baixa":
        return "text-green-600";
      case "media":
        return "text-blue-600";
      case "alta":
        return "text-orange-600";
      case "urgente":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) => filterStatus === "todos" || ticket.status === filterStatus
  );

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
            <h1 className="text-3xl font-bold text-foreground">Atendimento</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie solicitações e tickets de clientes
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: "",
                    description: "",
                    status: "aberto",
                    priority: "media",
                    client_name: "",
                    client_email: "",
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Ticket
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Ticket" : "Novo Ticket"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do ticket de atendimento
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    placeholder="Título do ticket"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea
                    placeholder="Descrição do problema ou solicitação"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input rounded-md text-sm mt-1"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome do Cliente</label>
                    <Input
                      placeholder="Nome"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData({ ...formData, client_name: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email do Cliente</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.client_email}
                      onChange={(e) =>
                        setFormData({ ...formData, client_email: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as "aberto" | "em_atendimento" | "resolvido" | "fechado",
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                        <SelectItem value="resolvido">Resolvido</SelectItem>
                        <SelectItem value="fechado">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Prioridade</label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          priority: value as "baixa" | "media" | "alta" | "urgente",
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {editingId ? "Atualizar" : "Criar"} Ticket
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="aberto">Aberto</SelectItem>
              <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
              <SelectItem value="resolvido">Resolvido</SelectItem>
              <SelectItem value="fechado">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhum ticket encontrado
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.description}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {ticket.client_name}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {ticket.client_email}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status.replace("_", " ")}
                        </span>
                        <span
                          className={`text-xs font-medium ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority.charAt(0).toUpperCase() +
                            ticket.priority.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Responder"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(ticket)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ticket.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
