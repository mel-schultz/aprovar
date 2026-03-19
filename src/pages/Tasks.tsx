import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase, Task, Project } from "@/lib/supabase";
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
import { Plus, Loader2, Trash2, Edit2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterPriority, setFilterPriority] = useState<string>("todos");
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    project_id: string;
    status: "pendente" | "em_progresso" | "revisao" | "concluida";
    priority: "baixa" | "media" | "alta" | "urgente";
    due_date: string;
  }>({
    title: "",
    description: "",
    project_id: "",
    status: "pendente",
    priority: "media",
    due_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      setProjects(projectsData || []);

      // Fetch tasks
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      setTasks(tasksData || []);
    } catch (error) {
      toast.error("Erro ao carregar dados");
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
          .from("tasks")
          .update({
            title: formData.title,
            description: formData.description,
            project_id: formData.project_id,
            status: formData.status,
            priority: formData.priority,
            due_date: formData.due_date || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        // Create
        const { error } = await supabase.from("tasks").insert({
          title: formData.title,
          description: formData.description,
          project_id: formData.project_id,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date || null,
          assigned_to: user?.id,
        });

        if (error) throw error;
        toast.success("Tarefa criada com sucesso!");
      }

      setFormData({
        title: "",
        description: "",
        project_id: "",
        status: "pendente",
        priority: "media",
        due_date: "",
      });
      setEditingId(null);
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Erro ao salvar tarefa");
      console.error(error);
    }
  };

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      project_id: task.project_id,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || "",
    });
    setEditingId(task.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) return;

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw error;
      toast.success("Tarefa deletada com sucesso!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao deletar tarefa");
      console.error(error);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === "concluida" ? "pendente" : "concluida";

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", task.id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      toast.error("Erro ao atualizar tarefa");
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-gray-100 text-gray-800";
      case "em_progresso":
        return "bg-blue-100 text-blue-800";
      case "revisao":
        return "bg-yellow-100 text-yellow-800";
      case "concluida":
        return "bg-green-100 text-green-800";
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

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filterStatus === "todos" || task.status === filterStatus;
    const priorityMatch =
      filterPriority === "todos" || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

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
            <h1 className="text-3xl font-bold text-foreground">Tarefas</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe e gerencie todas as tarefas
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
                    project_id: "",
                    status: "pendente",
                    priority: "media",
                    due_date: "",
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Tarefa
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Tarefa" : "Nova Tarefa"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados da tarefa
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    placeholder="Título da tarefa"
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
                    placeholder="Descrição da tarefa"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input rounded-md text-sm mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Projeto</label>
                  <Select
                    value={formData.project_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, project_id: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione um projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as "pendente" | "em_progresso" | "revisao" | "concluida",
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_progresso">Em Progresso</SelectItem>
                        <SelectItem value="revisao">Revisão</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
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

                <div>
                  <label className="text-sm font-medium">Prazo</label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) =>
                      setFormData({ ...formData, due_date: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {editingId ? "Atualizar" : "Criar"} Tarefa
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
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_progresso">Em Progresso</SelectItem>
              <SelectItem value="revisao">Revisão</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as Prioridades</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhuma tarefa encontrada
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const project = projects.find((p) => p.id === task.project_id);

              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleTaskStatus(task)}
                        className="mt-1 flex-shrink-0"
                      >
                        {task.status === "concluida" ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium ${
                            task.status === "concluida"
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {project && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {project.name}
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                          <span
                            className={`text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
