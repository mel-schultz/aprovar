import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase, UserProfile } from "@/lib/supabase";
import { useAuth, useIsAdmin } from "@/contexts/AuthContext";
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
import { Plus, Loader2, Trash2, Edit2, Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Users() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    full_name: string;
    role: "admin" | "atendimento" | "designer";
  }>({
    full_name: "",
    role: "designer",
  });

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/dashboard");
      return;
    }
    fetchUsers();
  }, [isAdmin, setLocation]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
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
          .from("profiles")
          .update({
            full_name: formData.full_name,
            role: formData.role,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Usuário atualizado com sucesso!");
      }

      setFormData({
        full_name: "",
        role: "designer",
      });
      setEditingId(null);
      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Erro ao salvar usuário");
      console.error(error);
    }
  };

  const handleEdit = (userProfile: UserProfile) => {
    setFormData({
      full_name: userProfile.full_name,
      role: userProfile.role,
    });
    setEditingId(userProfile.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (id === user?.id) {
      toast.error("Você não pode deletar sua própria conta");
      return;
    }

    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      // Delete from profiles first (due to foreign key)
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);

      if (profileError) throw profileError;

      toast.success("Usuário deletado com sucesso!");
      fetchUsers();
    } catch (error) {
      toast.error("Erro ao deletar usuário");
      console.error(error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-600" />;
      case "atendimento":
        return <UserIcon className="h-4 w-4 text-blue-600" />;
      case "designer":
        return <UserIcon className="h-4 w-4 text-green-600" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "atendimento":
        return "bg-blue-100 text-blue-800";
      case "designer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Acesso negado</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os usuários do sistema
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    full_name: "",
                    role: "designer",
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Usuário" : "Novo Usuário"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do usuário
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input
                    placeholder="Nome do usuário"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Perfil</label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        role: value as "admin" | "atendimento" | "designer",
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="atendimento">Atendimento</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {editingId ? "Atualizar" : "Criar"} Usuário
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {users.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhum usuário cadastrado
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((userProfile) => (
              <Card key={userProfile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getRoleIcon(userProfile.role)}
                        {userProfile.full_name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {userProfile.email}
                      </CardDescription>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRoleColor(
                        userProfile.role
                      )}`}
                    >
                      {userProfile.role}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(userProfile)}
                      className="flex-1"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(userProfile.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                      disabled={userProfile.id === user?.id}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Deletar
                    </Button>
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
