"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Calendar,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Puzzle,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/approvals", label: "Aprovações", icon: CheckSquare },
  { href: "/schedule", label: "Calendário", icon: Calendar },
  { href: "/team", label: "Equipe", icon: Users },
  { href: "/integrations", label: "Integrações", icon: Puzzle },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    toast.success("Até logo!");
    router.push("/login");
  }

  const sidebarW = collapsed ? 64 : 240;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 min-h-screen bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-200"
        style={{ width: sidebarW }}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-slate-200 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                <CheckSquare size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-brand">
                Aprova<span className="text-slate-900">Aí</span>
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="bg-slate-100 border-none rounded-lg p-1.5 cursor-pointer flex"
          >
            {collapsed ? (
              <ChevronRight size={15} />
            ) : (
              <ChevronLeft size={15} />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium text-slate-600 hover:text-brand hover:bg-slate-100 transition-all"
            >
              <Icon size={18} />
              {!collapsed && label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-200">
          {!collapsed && (
            <div className="px-3 py-2 mb-1 rounded-xl bg-slate-100">
              <p className="text-sm font-semibold text-slate-900 mb-0.5">
                {profile?.company || profile?.full_name || "Minha conta"}
              </p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            {!collapsed && "Sair"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div
        className="flex-1 flex flex-col transition-all duration-200"
        style={{ marginLeft: sidebarW }}
      >
        {/* Topbar */}
        <header className="h-15 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <button
            onClick={() => setMobileOpen(true)}
            className="hidden bg-none border-none cursor-pointer md:hidden"
          >
            <Menu size={20} />
          </button>
          <div />
          <div className="flex items-center gap-3">
            <button className="bg-slate-100 border-none rounded-lg p-2 cursor-pointer flex">
              <Bell size={18} className="text-slate-600" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-sm">
              {(profile?.company || profile?.full_name || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-7 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
