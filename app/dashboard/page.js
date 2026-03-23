'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Package,
  CheckCircle,
  Clock,
  Calendar,
  Star,
  Zap,
  Target,
  CheckCircle2,
  FileText,
  AlertCircle,
  XCircle,
  Settings,
  BarChart3,
  Plug,
  Bell,
  LogOut,
  LayoutDashboard,
  Building2,
  CheckSquare,
  Sun,
  Moon,
} from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'

export default function Dashboard() {
  const [stats] = useState([
    { id: 1, icon: Users, title: 'Clientes', count: '12', trend: '+2 este mês', color: '#0969da' },
    { id: 2, icon: Package, title: 'Entregáveis', count: '48', trend: '+8 pendentes', color: '#8250df' },
    { id: 3, icon: CheckCircle, title: 'Aprovados', count: '35', trend: '73% de taxa', color: '#1a7f37' },
    { id: 4, icon: Clock, title: 'Pendentes', count: '13', trend: 'Ação necessária', color: '#fb8500' },
    { id: 5, icon: Calendar, title: 'Próximos Eventos', count: '5', trend: 'Esta semana', color: '#6f42c1' },
    { id: 6, icon: Star, title: 'Taxa de Sucesso', count: '94%', trend: '+3% vs mês anterior', color: '#d1574a' },
    { id: 7, icon: Zap, title: 'Tempo Médio', count: '2.5d', trend: '-0.5d vs média', color: '#0969da' },
    { id: 8, icon: Target, title: 'Metas', count: '6/8', trend: '75% completadas', color: '#8250df' },
  ])

  const [recentActivity] = useState([
    { id: 1, icon: CheckCircle2, title: 'Projeto X aprovado', description: 'Cliente ABC aprovou o design', time: '2 horas atrás', status: 'success' },
    { id: 2, icon: FileText, title: 'Novo entregável', description: 'Maria enviou protótipos mobile', time: '4 horas atrás', status: 'info' },
    { id: 3, icon: AlertCircle, title: 'Prazo próximo', description: 'Website Homepage vence em 2 dias', time: '1 dia atrás', status: 'warning' },
    { id: 4, icon: XCircle, title: 'Rejeitado', description: 'Branding Guide foi rejeitado', time: '2 dias atrás', status: 'error' },
  ])

  const [quickLinks] = useState([
    { id: 1, icon: Users, label: 'Clientes', href: '/clientes' },
    { id: 2, icon: Package, label: 'Entregáveis', href: '/entregaveis' },
    { id: 3, icon: CheckCircle, label: 'Aprovações', href: '/aprovacoes' },
    { id: 4, icon: Calendar, label: 'Calendário', href: '/calendario' },
    { id: 5, icon: Settings, label: 'Admin', href: '/admin' },
    { id: 6, icon: BarChart3, label: 'Relatórios', href: '#' },
    { id: 7, icon: Plug, label: 'Integrações', href: '#' },
    { id: 8, icon: Bell, label: 'Notificações', href: '#' },
  ])

  return (
    <div className="app-shell">
      <AppSidebar activePath="/dashboard" />

      <main className="main-content">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo de volta! Aqui está um resumo da sua atividade</p>
          </div>
        </div>

        {/* STATS GRID - 4 COLUNAS */}
        <div className="grid-4col">
          {stats.map(stat => {
            const IconComponent = stat.icon
            return (
              <div key={stat.id} className="stat-card">
                <div className="stat-icon" style={{ color: stat.color }}>
                  <IconComponent size={24} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">{stat.title}</h3>
                  <div className="stat-count">{stat.count}</div>
                  <p className="stat-trend">{stat.trend}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* QUICK LINKS */}
        <div style={{ marginTop: '32px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--color-fg-default)' }}>Atalhos Rápidos</h2>
          <div className="grid-4col">
            {quickLinks.map(link => {
              const IconComponent = link.icon
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className="quick-link-card"
                >
                  <IconComponent size={20} />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--color-fg-default)' }}>Atividade Recente</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map(activity => {
              const IconComponent = activity.icon
              const statusColors = {
                success: '#1a7f37',
                info: '#0969da',
                warning: '#fb8500',
                error: '#da3633',
              }
              return (
                <div
                  key={activity.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'var(--color-canvas-subtle)',
                    border: '1px solid var(--color-border-muted)',
                    borderRadius: '6px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ color: statusColors[activity.status], marginTop: '2px', flexShrink: 0 }}>
                    <IconComponent size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-fg-default)' }}>
                      {activity.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-fg-muted)', marginTop: '2px' }}>
                      {activity.description}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-fg-muted)', whiteSpace: 'nowrap' }}>
                    {activity.time}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <style>{`
        .app-shell { display: flex; min-height: 100vh; }
        .main-content { flex: 1; padding: 24px; overflow-y: auto; background: var(--color-canvas-default); margin-left: 20px; }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: var(--color-fg-default);
          margin: 0 0 8px;
        }

        .page-header p {
          font-size: 14px;
          color: var(--color-fg-muted);
          margin: 0;
        }

        /* Grid Layout - 4 Colunas */
        .grid-4col {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--color-canvas-subtle);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          transition: all 0.15s ease;
        }

        .stat-card:hover {
          border-color: var(--color-accent-fg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-fg-muted);
          text-transform: uppercase;
          margin: 0 0 4px;
        }

        .stat-count {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-fg-default);
          margin: 0 0 4px;
        }

        .stat-trend {
          font-size: 11px;
          color: var(--color-fg-muted);
          margin: 0;
        }

        .quick-link-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: var(--color-canvas-subtle);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          text-decoration: none;
          color: var(--color-fg-default);
          transition: all 0.15s ease;
          font-size: 13px;
          font-weight: 500;
        }

        .quick-link-card:hover {
          border-color: var(--color-accent-fg);
          background: var(--color-accent-subtle);
          color: var(--color-accent-fg);
        }

        /* Responsividade */
        @media (max-width: 1400px) {
          .grid-4col {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .grid-4col {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .grid-4col {
            grid-template-columns: 1fr;
          }

          .main-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}

function AppSidebar({ activePath }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--color-fg-default)', textDecoration: 'none', padding: '8px 16px 12px' }}>
          <CheckCircle size={18} />
          AprovaAí
        </Link>
      </div>
      <nav>
        <NavLink href="/dashboard" label="Dashboard" icon={LayoutDashboard} active={activePath === '/dashboard'} />
        <NavLink href="/clientes" label="Clientes" icon={Building2} active={activePath === '/clientes'} />
        <NavLink href="/entregaveis" label="Entregáveis" icon={Package} active={activePath === '/entregaveis'} />
        <NavLink href="/calendario" label="Calendário" icon={Calendar} active={activePath === '/calendario'} />
        <NavLink href="/aprovacoes" label="Aprovações" icon={CheckSquare} active={activePath === '/aprovacoes'} />
        <NavLink href="/admin" label="Administração" icon={Settings} active={activePath === '/admin'} />
      </nav>
      <div className="sidebar-footer">
        <ThemeToggle />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: 'var(--color-danger-fg)', textDecoration: 'none', marginTop: '4px', transition: 'background-color 0.15s ease' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={14} />
          Sair
        </Link>
      </div>

      <style>{`
        .sidebar {
          width: 240px;
          background: var(--color-canvas-subtle);
          border-right: 1px solid var(--color-border-muted);
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow-y: auto;
          position: sticky;
          top: 0;
        }

        .sidebar-header {
          padding: 16px 0;
          border-bottom: 1px solid var(--color-border-muted);
        }

        .sidebar nav {
          flex: 1;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-footer {
          padding: 12px 8px;
          border-top: 1px solid var(--color-border-muted);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-fg-muted);
          text-decoration: none;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .nav-item:hover {
          background: var(--hover-bg);
          color: var(--color-fg-default);
        }

        .nav-item.active {
          background: var(--color-accent-subtle);
          color: var(--color-accent-fg);
        }

        .nav-icon {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
          }
        }
      `}</style>
    </aside>
  )
}

function NavLink({ href, label, icon: Icon, active }) {
  return (
    <Link href={href} className={`nav-item${active ? ' active' : ''}`}>
      <span className="nav-icon">
        <Icon size={16} />
      </span>
      {label}
    </Link>
  )
}
