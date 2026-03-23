'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase-client'
import Link from 'next/link'
import ThemeToggle from '../../components/ThemeToggle'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" aria-label="Carregando" />
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar onLogout={handleLogout} activePath="/dashboard" />

      <main className="main-content">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo de volta, {user?.email || 'Usuário'}</p>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="stats-grid">
          <StatCard
            icon={<IconClients />}
            title="Clientes"
            count="12"
            trend="+2 este mês"
            color="blue"
          />
          <StatCard
            icon={<IconPackage />}
            title="Entregáveis"
            count="48"
            trend="+8 pendentes"
            color="purple"
          />
          <StatCard
            icon={<IconCheck />}
            title="Aprovados"
            count="35"
            trend="73% de taxa"
            color="green"
          />
          <StatCard
            icon={<IconClock />}
            title="Pendentes"
            count="13"
            trend="Ação necessária"
            color="orange"
          />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="grid-2col">
          <div className="card">
            <div className="card-header">
              <h2>Atividade Recente</h2>
            </div>
            <div className="activity-list">
              <ActivityItem
                icon="check"
                title="Projeto X aprovado"
                description="Cliente ABC aprovou o design"
                time="2 horas atrás"
                status="success"
              />
              <ActivityItem
                icon="alert"
                title="Prazo próximo"
                description="Entregável do projeto Y vence amanhã"
                time="4 horas atrás"
                status="warning"
              />
              <ActivityItem
                icon="user"
                title="Novo cliente"
                description="Empresa XYZ foi adicionada ao sistema"
                time="1 dia atrás"
                status="info"
              />
              <ActivityItem
                icon="file"
                title="Upload concluído"
                description="Arquivo de apresentação enviado"
                time="2 dias atrás"
                status="info"
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Próximas Ações</h2>
            </div>
            <div className="action-list">
              <ActionItem
                title="Revisar protótipos"
                client="Cliente ABC"
                dueDate="Hoje"
                priority="high"
              />
              <ActionItem
                title="Enviar apresentação"
                client="Empresa XYZ"
                dueDate="Amanhã"
                priority="high"
              />
              <ActionItem
                title="Reunião com cliente"
                client="Projeto Y"
                dueDate="Quarta-feira"
                priority="medium"
              />
              <ActionItem
                title="Atualizar documentação"
                client="Interno"
                dueDate="Próxima semana"
                priority="low"
              />
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <section>
          <h2 className="section-title">Atalhos rápidos</h2>
          <div className="quick-actions-grid">
            <QuickAction href="/clientes" title="Novo cliente" icon={<IconPlus />} desc="Adicione um novo cliente ao sistema" />
            <QuickAction href="/entregaveis" title="Novo entregável" icon={<IconUpload />} desc="Faça upload de um entregável" />
            <QuickAction href="/calendario" title="Calendário" icon={<IconCalendar />} desc="Visualize eventos e prazos" />
            <QuickAction href="/aprovacoes" title="Aprovações" icon={<IconCheck />} desc="Revise e gerencie aprovações" />
          </div>
        </section>
      </main>

      <style>{`
        .app-shell { display: flex; min-height: 100vh; }
        
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 12px;
          color: var(--color-fg-muted);
          font-size: 14px;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-border-muted);
          border-top-color: var(--color-accent-fg);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .spinner-lg {
          width: 40px;
          height: 40px;
          border-width: 4px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 20px;
          transition: all 0.15s ease;
        }

        .stat-card:hover {
          border-color: var(--color-border-muted);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-icon.blue {
          background: var(--color-accent-subtle);
          color: var(--color-accent-fg);
        }

        .stat-icon.green {
          background: #d1fae5;
          color: #065f46;
        }

        .stat-icon.orange {
          background: #fed7aa;
          color: #92400e;
        }

        .stat-icon.purple {
          background: #f3e8ff;
          color: #6b21a8;
        }

        .stat-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-fg-muted);
          margin: 0;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--color-fg-default);
          margin: 8px 0 0;
        }

        .stat-trend {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin-top: 8px;
        }

        /* Grid Layout */
        .grid-2col {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .card {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          overflow: hidden;
        }

        .card-header {
          padding: 16px;
          border-bottom: 1px solid var(--color-border-muted);
        }

        .card-header h2 {
          font-size: 15px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          divide-y: 1px solid var(--color-border-muted);
        }

        .activity-item {
          padding: 12px 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          transition: background-color 0.15s ease;
        }

        .activity-item:hover {
          background: var(--hover-bg);
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .activity-icon.success {
          background: #d1fae5;
          color: #065f46;
        }

        .activity-icon.warning {
          background: #fed7aa;
          color: #92400e;
        }

        .activity-icon.info {
          background: var(--color-accent-subtle);
          color: var(--color-accent-fg);
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        .activity-desc {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 2px 0 0;
        }

        .activity-time {
          font-size: 11px;
          color: var(--color-fg-muted);
          margin-top: 4px;
        }

        /* Action List */
        .action-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .action-item {
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border-muted);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: background-color 0.15s ease;
        }

        .action-item:hover {
          background: var(--hover-bg);
        }

        .action-item:last-child {
          border-bottom: none;
        }

        .action-info {
          flex: 1;
          min-width: 0;
        }

        .action-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        .action-meta {
          font-size: 11px;
          color: var(--color-fg-muted);
          margin-top: 2px;
        }

        .action-priority {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .action-priority.high {
          background: #fee2e2;
          color: #991b1b;
        }

        .action-priority.medium {
          background: #fed7aa;
          color: #92400e;
        }

        .action-priority.low {
          background: #d1fae5;
          color: #065f46;
        }

        /* Section Title */
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin-bottom: 12px;
        }

        /* Quick Actions Grid */
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .quick-action {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s ease;
        }

        .quick-action:hover {
          border-color: var(--color-accent-fg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          text-decoration: none;
          color: inherit;
        }

        .quick-action-icon {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: var(--color-accent-subtle);
          border: 1px solid var(--color-accent-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent-fg);
          font-size: 18px;
        }

        .quick-action h3 {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        .quick-action p {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .grid-2col {
            grid-template-columns: 1fr;
          }

          .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

function StatCard({ icon, title, count, trend, color }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className={`stat-icon ${color}`}>{icon}</div>
        <h3 className="stat-title">{title}</h3>
      </div>
      <div className="stat-value">{count}</div>
      <div className="stat-trend">{trend}</div>
    </div>
  )
}

function ActivityItem({ icon, title, description, time, status }) {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${status}`}>
        {icon === 'check' && '✓'}
        {icon === 'alert' && '!'}
        {icon === 'user' && '👤'}
        {icon === 'file' && '📄'}
      </div>
      <div className="activity-content">
        <h3 className="activity-title">{title}</h3>
        <p className="activity-desc">{description}</p>
        <div className="activity-time">{time}</div>
      </div>
    </div>
  )
}

function ActionItem({ title, client, dueDate, priority }) {
  return (
    <div className="action-item">
      <div className="action-info">
        <h3 className="action-title">{title}</h3>
        <div className="action-meta">{client} • {dueDate}</div>
      </div>
      <span className={`action-priority ${priority}`}>
        {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Média' : 'Baixa'}
      </span>
    </div>
  )
}

function QuickAction({ href, title, icon, desc }) {
  return (
    <Link href={href} className="quick-action">
      <div className="quick-action-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </Link>
  )
}

function Sidebar({ onLogout, activePath }) {
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
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '6px 8px',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            fontFamily: 'inherit',
            color: 'var(--color-danger-fg)',
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
            marginTop: '8px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--color-danger-subtle)'
            e.currentTarget.style.borderColor = 'var(--color-danger-muted)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z" />
          </svg>
          Sair
        </button>
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

// Icons
function IconClients() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 10a3 3 0 100-6 3 3 0 000 6zM3.172 5.172a4 4 0 015.656 0M15.172 5.172a4 4 0 010 5.656M1.172 15.172a6 6 0 0111.656 0M18.172 15.172a6 6 0 01-11.656 0" /></svg>
}

function IconPackage() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M2 4a1 1 0 011-1h2.153a1 1 0 01.986.852l.722 5.14h10.282l.722-5.14A1 1 0 0116.847 3H18a1 1 0 011 1v2a1 1 0 01-.923 0.997l-1.923 5.265a2 2 0 01-1.879 1.34H7.773a2 2 0 01-1.877-1.34L3.923 6.997A1 1 0 013 6V4z" /></svg>
}

function IconCheck() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
}

function IconClock() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm.5-13H9v6l5.25 3.15.75-1.23-4.5-2.67z" clipRule="evenodd" /></svg>
}

function IconPlus() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11H9v3H6v2h3v3h2v-3h3v-2h-3V7z" clipRule="evenodd" /></svg>
}

function IconUpload() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" /></svg>
}

function IconCalendar() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a2 2 0 002-2h8a2 2 0 002 2v8H6V7z" /></svg>
}
