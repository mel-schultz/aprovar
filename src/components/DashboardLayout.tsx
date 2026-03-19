import React, { useState } from "react";
import { useAuth, useIsAdmin } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Calendar as CalendarIcon,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, signOut } = useAuth();
  const [location, setLocation] = useLocation();
  const isAdmin = useIsAdmin();

  const navigationItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["admin", "atendimento", "designer"],
    },
    {
      label: "Projetos",
      icon: FolderOpen,
      href: "/projects",
      roles: ["admin", "atendimento", "designer"],
    },
    {
      label: "Tarefas",
      icon: CheckSquare,
      href: "/tasks",
      roles: ["admin", "atendimento", "designer"],
    },
    {
      label: "Calendario",
      icon: CalendarIcon,
      href: "/calendar",
      roles: ["admin", "atendimento", "designer"],
    },
    {
      label: "Atendimento",
      icon: Users,
      href: "/tickets",
      roles: ["admin", "atendimento"],
    },
    {
      label: "Relatórios",
      icon: FileText,
      href: "/reports",
      roles: ["admin", "atendimento"],
    },
    {
      label: "Usuários",
      icon: Users,
      href: "/users",
      roles: ["admin"],
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/settings",
      roles: ["admin"],
    },
  ];

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  const handleLogout = async () => {
    await signOut();
    setLocation("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-sidebar-primary">eKyte</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-sidebar-accent rounded-md transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <button
                key={item.href}
                onClick={() => setLocation(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-sidebar-primary-foreground" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.full_name}</p>
                <p className="text-xs opacity-75 truncate capitalize">
                  {user?.role}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors text-sm",
              sidebarOpen ? "justify-start" : "justify-center"
            )}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {filteredItems.find((item) => item.href === location)?.label ||
              "Dashboard"}
          </h2>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-md transition-colors relative">
              <Bell size={20} className="text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
