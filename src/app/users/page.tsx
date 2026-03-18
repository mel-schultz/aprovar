"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Shield,
  User,
  Mail,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Card, Modal, FormField, EmptyState, StatusBadge } from "@/components/ui";
import { TeamMember, ROLE_LABELS, ROLE_COLORS, UserRole } from "@/types";
import { AppLayout } from "@/components/layout/AppLayout";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

function UserForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: TeamMember;
  onSave: (form: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    full_name: initial?.full_name || "",
    email: initial?.email || "",
    role: (initial?.role || "designer") as UserRole,
    can_create: initial?.can_create || false,
    can_edit: initial?.can_edit || false,
    can_delete: initial?.can_delete || false,
    can_manage_team: initial?.can_manage_team || false,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Nome completo">
        <input
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="João Silva"
          required
        />
      </FormField>

      <FormField label="E-mail">
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="joao@empresa.com"
          required
          disabled={!!initial}
        />
      </FormField>

      <FormField label="Função">
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
        >
          <option value="designer">Designer</option>
          <option value="atendimento">Atendimento</option>
          <option value="admin">Administrador</option>
        </select>
      </FormField>

      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
        <p className="text-xs font-semibold text-slate-700 mb-3">Permissões</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.can_create}
              onChange={(e) => setForm({ ...form, can_create: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Criar conteúdo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.can_edit}
              onChange={(e) => setForm({ ...form, can_edit: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Editar conteúdo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.can_delete}
              onChange={(e) => setForm({ ...form, can_delete: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Deletar conteúdo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.can_manage_team}
              onChange={(e) => setForm({ ...form, can_manage_team: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Gerenciar equipe</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? "Atualizar" : "Convidar"}
        </Button>
      </div>
    </form>
  );
}

export default function UsersPage() {
  const { profile, canManageUsers } = useAuth();
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "create" | { edit: TeamMember }>(null);

  useEffect(() => {
    if (!profile) return;
    loadUsers();
  }, [profile]);

  async function loadUsers() {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("profile_id", profile?.id || "")
      .order("created_at", { ascending: false });

    if (!error) setUsers(data || []);
    setLoading(false);
  }

  async function handleSave(form: any) {
    try {
      if (modal === "create") {
        const { data, error } = await supabase
          .from("team_members")
          .insert({
            profile_id: profile?.id,
            email: form.email,
            full_name: form.full_name,
            role: form.role,
            can_create: form.can_create,
            can_edit: form.can_edit,
            can_delete: form.can_delete,
            can_manage_team: form.can_manage_team,
          })
          .select()
          .single();

        if (error) throw error;
        setUsers((u) => [data, ...u]);
        toast.success("Usuário convidado com sucesso!");
      } else if (modal?.edit) {
        const { data, error } = await supabase
          .from("team_members")
          .update({
            full_name: form.full_name,
            role: form.role,
            can_create: form.can_create,
            can_edit: form.can_edit,
            can_delete: form.can_delete,
            can_manage_team: form.can_manage_team,
          })
          .eq("id", modal.edit.id)
          .select()
          .single();

        if (error) throw error;
        setUsers((u) => u.map((user) => (user.id === data.id ? data : user)));
        toast.success("Usuário atualizado!");
      }
      setModal(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Tem certeza que deseja remover este usuário?")) return;

    try {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
      setUsers((u) => u.filter((user) => user.id !== id));
      toast.success("Usuário removido!");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (!canManageUsers()) {
    return (
      <AppLayout>
        <div className="page-enter">
          <div className="bg-red-100 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-red-900" />
            <span className="text-sm text-red-900 font-medium">
              Você não tem permissão para gerenciar usuários.
            </span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-enter">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-3xl font-bold mb-1">Gerenciar Usuários</h1>
            <p className="text-slate-600 text-base">
              Controle os membros da equipe e suas permissões.
            </p>
          </div>
          <Button onClick={() => setModal("create")}>
            <Plus size={16} /> Novo usuário
          </Button>
        </div>

        {loading ? (
          <Card className="p-10 text-center">
            <p className="text-slate-600">Carregando...</p>
          </Card>
        ) : users.length === 0 ? (
          <Card>
            <EmptyState
              icon={Users}
              title="Nenhum usuário ainda"
              description="Convide membros da equipe para começar."
              action={
                <Button onClick={() => setModal("create")}>
                  <Plus size={16} /> Convidar usuário
                </Button>
              }
            />
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700">
                      Usuário
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700">
                      Função
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700">
                      Permissões
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-700">
                      Último acesso
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                            {(user.full_name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {user.full_name || "Sem nome"}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5">
                          {user.can_create && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              Criar
                            </span>
                          )}
                          {user.can_edit && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              Editar
                            </span>
                          )}
                          {user.can_delete && (
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                              Deletar
                            </span>
                          )}
                          {user.can_manage_team && (
                            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                              Gerenciar
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {user.last_login
                          ? formatDistanceToNow(new Date(user.last_login), {
                              locale: ptBR,
                              addSuffix: true,
                            })
                          : "Nunca"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setModal({ edit: user })}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Modal
          open={modal === "create"}
          onClose={() => setModal(null)}
          title="Convidar novo usuário"
        >
          <UserForm onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>

        <Modal
          open={!!modal && "edit" in modal}
          onClose={() => setModal(null)}
          title="Editar usuário"
        >
          {modal && "edit" in modal && (
            <UserForm
              initial={modal.edit}
              onSave={handleSave}
              onCancel={() => setModal(null)}
            />
          )}
        </Modal>
      </div>
    </AppLayout>
  );
}
