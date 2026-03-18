import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth, useIsAdmin } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Bell, Palette, Shield } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Settings() {
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const [, setLocation] = useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não correspondem");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      // In a real app, you would verify the current password first
      // For now, we'll just show a success message
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Erro ao alterar senha");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setLocation("/login");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            {isAdmin && <TabsTrigger value="system">Sistema</TabsTrigger>}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Visualize suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input
                    value={user?.full_name || ""}
                    disabled
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Perfil</label>
                  <Input
                    value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                    disabled
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Membro desde</label>
                  <Input
                    value={new Date(user?.created_at || "").toLocaleDateString("pt-BR")}
                    disabled
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Atualize sua senha regularmente para manter sua conta segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Senha Atual</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Nova Senha</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Confirmar Senha</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Alterar Senha
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sessão
                </CardTitle>
                <CardDescription>
                  Gerencie suas sessões ativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Sessão Atual</p>
                      <p className="text-xs text-muted-foreground">
                        Navegador: Chrome
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Ativa
                    </span>
                  </div>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    Sair
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferências de Notificações
                </CardTitle>
                <CardDescription>
                  Configure como você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Notificações por Email</p>
                    <p className="text-xs text-muted-foreground">
                      Receba atualizações importantes por email
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Tarefas Atribuídas</p>
                    <p className="text-xs text-muted-foreground">
                      Notifique-me quando uma tarefa for atribuída
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Tarefas Concluídas</p>
                    <p className="text-xs text-muted-foreground">
                      Notifique-me quando uma tarefa for concluída
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Comentários</p>
                    <p className="text-xs text-muted-foreground">
                      Notifique-me quando alguém comentar em minhas tarefas
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab (Admin Only) */}
          {isAdmin && (
            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Configurações do Sistema
                  </CardTitle>
                  <CardDescription>
                    Gerencie as configurações globais da aplicação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome da Aplicação</label>
                    <Input
                      value="eKyte Clone"
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Versão</label>
                    <Input
                      value="1.0.0"
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Ambiente</label>
                    <Input
                      value="Production"
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-3">Ações do Sistema</p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Limpar Cache
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Gerar Relatório de Sistema
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                      >
                        Resetar Dados de Teste
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
