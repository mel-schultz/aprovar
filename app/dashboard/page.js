'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '../../components/ThemeToggle'

export default function Dashboard() {
  const [stats] = useState([
    { id: 1, icon: '👥', title: 'Clientes', count: '12', trend: '+2 este mês', color: '#0969da' },
    { id: 2, icon: '📦', title: 'Entregáveis', count: '48', trend: '+8 pendentes', color: '#8250df' },
    { id: 3, icon: '✓', title: 'Aprovados', count: '35', trend: '73% de taxa', color: '#1a7f37' },
    { id: 4, icon: '⏳', title: 'Pendentes', count: '13', trend: 'Ação necessária', color: '#fb8500' },
    { id: 5, icon: '📅', title: 'Próximos Eventos', count: '5', trend: 'Esta semana', color: '#6f42c1' },
    { id: 6, icon: '⭐', title: 'Taxa de Sucesso', count: '94%', trend: '+3% vs mês anterior', color: '#d1574a' },
    { id: 7, icon: '⚡', title: 'Tempo Médio', count: '2.5d', trend: '-0.5d vs média', color: '#0969da' },
    { id: 8, icon: '🎯', title: 'Metas', count: '6/8', trend: '75% completadas', color: '#8250df' },
  ])

  const [recentActivity] = useState([
    { id: 1, icon: '✓', title: 'Projeto X aprovado', description: 'Cliente ABC aprovou o design', time: '2 horas atrás', status: 'success' },
    { id: 2, icon: '📝', title: 'Novo entregável', description: 'Maria enviou protótipos mobile', time: '4 horas atrás', status: 'info' },
    { id: 3, icon: '⚠️', title: 'Prazo próximo', description: 'Website Homepage vence em 2 dias', time: '1 dia atrás', status: 'warning' },
    { id: 4, icon: '✗', title: 'Rejeitado', description: 'Branding Guide foi rejeitado', time: '2 dias atrás', status: 'error' },
  ])

  const [quickLinks] = useState([
    { id: 1, icon: '👥', label: 'Clientes', href: '/clientes' },
    { id: 2, icon: '📦', label: 'Entregáveis', href: '/entregaveis' },
    { id: 3, icon: '✓', label: 'Aprovações', href: '/aprovacoes' },
    { id: 4, icon: '📅', label: 'Calendário', href: '/calendario' },
    { id: 5, icon: '⚙️', label: 'Admin', href: '/admin' },
    { id: 6, icon: '📊', label: 'Relatórios', href: '#' },
    { id: 7, icon: '⚡', label: 'Integrações', href: '#' },
    { id: 8, icon: '🔔', label: 'Notificações', href: '#' },
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
          {stats.map(stat => (
            <div key={stat.id} className="stat-container">
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-count">{stat.count}</div>
                <p className="stat-trend">{stat.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK LINKS GRID - 4 COLUNAS */}
        <div className="section-title">
          <h2>Atalhos Rápidos</h2>
        </div>
        <div className="grid-4col">
          {quickLinks.map(link => (
            <Link key={link.id} href={link.href} className="quick-link-container">
              <div className="quick-link-icon">{link.icon}</div>
              <div className="quick-link-label">{link.label}</div>
            </Link>
          ))}
        </div>

        {/* RECENT ACTIVITY GRID - 4 COLUNAS */}
        <div className="section-title">
          <h2>Atividade Recente</h2>
        </div>
        <div className="grid-4col">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-container">
              <div className={`activity-icon activity-${activity.status}`}>
                {activity.icon}
              </div>
              <div className="activity-content">
                <h4 className="activity-title">{activity.title}</h4>
                <p className="activity-desc">{activity.description}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .app-shell { display: flex; min-height: 100vh; }
        .main-content { flex: 1; padding: 24px; overflow-y: auto; background: var(--color-canvas-default); }

        /* Grid Layout - 4 Colunas */
        .grid-4col {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .section-title {
          margin-top: 32px;
          margin-bottom: 16px;
        }

        .section-title h2 {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        /* Stat Container */
        .stat-container {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: all 0.15s ease;
          cursor: pointer;
        }

        .stat-container:hover {
          border-color: var(--color-border-muted);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
          min-width: 0;
        }

        .stat-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-fg-muted);
          text-transform: uppercase;
          margin: 0 0 4px;
          letter-spacing: 0.04em;
        }

        .stat-count {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-fg-default);
          margin-bottom: 4px;
        }

        .stat-trend {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 0;
        }

        /* Quick Link Container */
        .quick-link-container {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-decoration: none;
          color: var(--color-fg-default);
          transition: all 0.15s ease;
        }

        .quick-link-container:hover {
          border-color: var(--color-accent-fg);
          background: var(--color-accent-subtle);
          transform: translateY(-2px);
        }

        .quick-link-icon {
          font-size: 32px;
        }

        .quick-link-label {
          font-size: 13px;
          font-weight: 600;
          text-align: center;
          color: var(--color-fg-default);
        }

        /* Activity Container */
        .activity-container {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          gap: 12px;
          transition: all 0.15s ease;
        }

        .activity-container:hover {
          border-color: var(--color-border-muted);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .activity-icon.activity-success {
          background: #d1fae5;
          color: #065f46;
        }

        .activity-icon.activity-info {
          background: #dbeafe;
          color: #1e40af;
        }

        .activity-icon.activity-warning {
          background: #fed7aa;
          color: #92400e;
        }

        .activity-icon.activity-error {
          background: #fee2e2;
          color: #991b1b;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0 0 4px;
        }

        .activity-desc {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 0 0 6px;
          line-height: 1.4;
        }

        .activity-time {
          font-size: 11px;
          color: var(--color-fg-muted);
          font-weight: 500;
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

          .section-title {
            margin-top: 24px;
            margin-bottom: 12px;
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
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          AprovaAí
        </Link>
      </div>
      <nav>
        <NavLink href="/dashboard" label="Dashboard" icon="dashboard" active={activePath === '/dashboard'} />
        <NavLink href="/clientes" label="Clientes" icon="building" active={activePath === '/clientes'} />
        <NavLink href="/entregaveis" label="Entregáveis" icon="package" active={activePath === '/entregaveis'} />
        <NavLink href="/calendario" label="Calendário" icon="calendar" active={activePath === '/calendario'} />
        <NavLink href="/aprovacoes" label="Aprovações" icon="check" active={activePath === '/aprovacoes'} />
        <NavLink href="/admin" label="Administração" icon="gear" active={activePath === '/admin'} />
      </nav>
      <div className="sidebar-footer">
        <ThemeToggle />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: 'var(--color-danger-fg)', textDecoration: 'none', marginTop: '4px', transition: 'background-color 0.15s ease' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z" />
          </svg>
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

function NavLink({ href, label, icon, active }) {
  return (
    <Link href={href} className={`nav-item${active ? ' active' : ''}`}>
      <span className="nav-icon">
        {icon === 'dashboard' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M1.75 1a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h12.5a.75.75 0 0 0 .75-.75V1.75a.75.75 0 0 0-.75-.75H1.75zM2.5 4h3V2.5h-3V4zm0 3h3V5.5h-3V7zm0 3h3v-1.5h-3V10zm4-6h3V2.5h-3V4zm0 3h3V5.5h-3V7zm0 3h3v-1.5h-3V10zm4-6h3V2.5h-3V4zm0 3h3V5.5h-3V7zm0 3h3v-1.5h-3V10z" />
          </svg>
        )}
        {icon === 'building' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M1.75 1a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h12.5a.75.75 0 0 0 .75-.75V1.75a.75.75 0 0 0-.75-.75H1.75zM2.5 4h2V2.5h-2V4zm3 0h2V2.5h-2V4zm3 0h2V2.5h-2V4zm3 0h2V2.5h-2V4zM2.5 7h2V5.5h-2V7zm3 0h2V5.5h-2V7zm3 0h2V5.5h-2V7zm3 0h2V5.5h-2V7zM2.5 10h2V8.5h-2V10zm3 0h2V8.5h-2V10zm3 0h2V8.5h-2V10zm3 0h2V8.5h-2V10z" />
          </svg>
        )}
        {icon === 'package' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1.5a.75.75 0 0 1 .75.75v1.5h3.5a1.75 1.75 0 0 1 1.75 1.75v7.5a1.75 1.75 0 0 1-1.75 1.75h-9.5A1.75 1.75 0 0 1 1 14v-7.5A1.75 1.75 0 0 1 2.75 4.5h3.5V2.25a.75.75 0 0 1 .75-.75zM2.5 5.5v8.5a.25.25 0 0 0 .25.25h9.5a.25.25 0 0 0 .25-.25V5.5z" />
          </svg>
        )}
        {icon === 'calendar' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0z" />
          </svg>
        )}
        {icon === 'check' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
        )}
        {icon === 'gear' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM7 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
            <path d="M8.5 1.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
            <path d="M8.5 14.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
            <path d="M1.5 8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
            <path d="M14.5 8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
          </svg>
        )}
      </span>
      {label}
    </Link>
  )
}
