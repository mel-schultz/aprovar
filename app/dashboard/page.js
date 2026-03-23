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
        <span className="spinner spinner-lg" aria-label="Carregando" />
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
            count="--"
            color="var(--color-accent-fg)"
          />
          <StatCard
            icon={<IconPackage />}
            title="Entregáveis"
            count="--"
            color="var(--color-accent-fg)"
          />
          <StatCard
            icon={<IconCheck />}
            title="Aprovados"
            count="--"
            color="var(--color-success-fg)"
          />
          <StatCard
            icon={<IconClock />}
            title="Pendentes"
            count="--"
            color="var(--color-warning-fg)"
          />
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

        .spinner-lg {
          width: 24px !important;
          height: 24px !important;
          border-width: 2px !important;
        }

        .app-shell {
          display: flex;
          min-height: 100vh;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 6px;
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: var(--color-accent-subtle);
          border: 1px solid var(--color-accent-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color-accent-fg);
        }

        .stat-icon.success {
          background: var(--color-success-subtle);
          border-color: var(--color-success-muted);
          color: var(--color-success-fg);
        }

        .stat-icon.warning {
          background: var(--color-warning-subtle);
          border-color: var(--color-warning-muted);
          color: var(--color-warning-fg);
        }

        .stat-info {
          flex: 1;
          min-width: 0;
        }

        .stat-label {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin-bottom: 4px;
          font-weight: 500;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-fg-default);
          line-height: 1;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin-bottom: 12px;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .quick-action {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 6px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .quick-action:hover {
          border-color: var(--color-accent-fg);
          box-shadow: var(--color-shadow-medium);
          text-decoration: none;
          color: inherit;
        }

        .quick-action-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: var(--color-accent-subtle);
          border: 1px solid var(--color-accent-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent-fg);
        }

        .quick-action h3 {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin-bottom: 2px;
        }

        .quick-action p {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 1024px) {
          .stats-grid,
          .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-grid,
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

function Sidebar({ onLogout, activePath }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/dashboard" className="sidebar-logo">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>AprovaAí</span>
        </Link>
      </div>

      <nav>
        <NavLink href="/dashboard" label="Dashboard" icon={<IconDashboard />} active={activePath === '/dashboard'} />
        <NavLink href="/clientes" label="Clientes" icon={<IconBuilding />} active={activePath === '/clientes'} />
        <NavLink href="/entregaveis" label="Entregáveis" icon={<IconPackage />} active={activePath === '/entregaveis'} />
        <NavLink href="/calendario" label="Calendário" icon={<IconCalendar />} active={activePath === '/calendario'} />
        <NavLink href="/aprovacoes" label="Aprovações" icon={<IconCheck />} active={activePath === '/aprovacoes'} />
        <NavLink href="/admin" label="Administração" icon={<IconGear />} active={activePath === '/admin'} />
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="sidebar-logout"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z" />
          </svg>
          Sair
        </button>
      </div>

      <style>{`
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-fg-default);
          text-decoration: none;
          padding: 8px 16px 12px;
        }

        .sidebar-logo:hover {
          text-decoration: none;
          color: var(--color-fg-default);
        }

        .sidebar-logo svg {
          color: var(--color-accent-fg);
          flex-shrink: 0;
        }

        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 6px 8px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          color: var(--color-danger-fg);
          transition: background-color 0.15s ease, border-color 0.15s ease;
          margin-top: 8px;
        }

        .sidebar-logout:hover {
          background: var(--color-danger-subtle);
          border-color: var(--color-danger-muted);
        }
      `}</style>
    </aside>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link
      href={href}
      className={`nav-item${active ? ' active' : ''}`}
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function StatCard({ icon, title, count, color }) {
  const isSuccess = color === 'var(--color-success-fg)'
  const isWarning = color === 'var(--color-warning-fg)'
  return (
    <div className="stat-card">
      <div className={`stat-icon${isSuccess ? ' success' : isWarning ? ' warning' : ''}`}>
        {icon}
      </div>
      <div className="stat-info">
        <p className="stat-label">{title}</p>
        <p className="stat-value">{count}</p>
      </div>
    </div>
  )
}

function QuickAction({ href, title, icon, desc }) {
  return (
    <Link href={href} className="quick-action">
      <div className="quick-action-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </Link>
  )
}

/* ---- SVG Icons ---- */
function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1 2.75A.75.75 0 0 1 1.75 2h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 1 7.75ZM1.75 12h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5ZM9 2.75A.75.75 0 0 1 9.75 2h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 2.75ZM9.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 7.75.75.75 0 0 1 9.75 7ZM9 12.75A.75.75 0 0 1 9.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 12.75Z" />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h3.75a.75.75 0 0 1 0 1.5H1.75Z" />
      <path d="M3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 6.75.75.75 0 0 1 3.75 6ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM7 6.75A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM13 13.25a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-1.5h3v1.5Zm-3-3h3v.5h-3v-.5Z" />
    </svg>
  )
}

function IconPackage() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="m8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.2.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.25.25 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
    </svg>
  )
}

function IconGear() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z" />
    </svg>
  )
}

function IconClients() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M5.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.507 5.507 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5Z" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
    </svg>
  )
}

function IconUpload() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8.75 1.75a.75.75 0 0 0-1.5 0V7H3.75a.75.75 0 0 0 0 1.5H7.25v5.25a.75.75 0 0 0 1.5 0V8.5h3.5a.75.75 0 0 0 0-1.5H8.75V1.75Z" />
    </svg>
  )
}
