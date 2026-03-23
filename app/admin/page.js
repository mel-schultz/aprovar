'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Admin() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: 'Seu Nome', email: 'seu@email.com', role: 'admin', status: 'ativo', criadoEm: '2024-03-20' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', role: 'cliente' })

  const handleAddUser = (e) => {
    e.preventDefault()
    if (!formData.nome.trim() || !formData.email.trim()) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    setUsuarios([...usuarios, {
      ...formData,
      id: Date.now(),
      status: 'ativo',
      criadoEm: new Date().toISOString().split('T')[0]
    }])
    setFormData({ nome: '', email: '', role: 'cliente' })
    setShowForm(false)
  }

  const handleDeleteUser = (id) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      setUsuarios(usuarios.filter(u => u.id !== id))
    }
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return { className: 'role-badge role-admin', label: 'Admin' }
      case 'atendimento': return { className: 'role-badge role-atendimento', label: 'Atendimento' }
      default: return { className: 'role-badge role-cliente', label: 'Cliente' }
    }
  }

  return (
    <div className="app-shell">
      <AppSidebar activePath="/admin" />

      <main className="main-content">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div className="page-header-content">
            <div>
              <h1>Administração</h1>
              <p>Gerencie usuários, funções e permissões do sistema</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
            >
              {showForm ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                  Cancelar
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
                  </svg>
                  Novo usuário
                </>
              )}
            </button>
          </div>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Criar novo usuário</h2>
            <form onSubmit={handleAddUser}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="nome">Nome completo <span className="required">*</span></label>
                  <input
                    id="nome"
                    type="text"
                    placeholder="João da Silva"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    id="email"
                    type="email"
                    placeholder="joao@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="role">Função</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="atendimento">Atendimento</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Criar usuário
                </button>
              </div>
            </form>
          </div>
        )}

        {/* USERS TABLE */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="card-header">
            <h2 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
              Usuários cadastrados
              <span className="count-badge">{usuarios.length}</span>
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => {
                  const roleBadge = getRoleBadge(u.role)
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{u.nome.charAt(0).toUpperCase()}</div>
                          <span className="user-name">{u.nome}</span>
                        </div>
                      </td>
                      <td className="text-muted">{u.email}</td>
                      <td>
                        <span className={roleBadge.className}>{roleBadge.label}</span>
                      </td>
                      <td>
                        <span className="status-badge status-approved">{u.status}</span>
                      </td>
                      <td className="text-muted text-sm">{u.criadoEm}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-secondary btn-xs">
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="btn btn-danger-outline btn-xs"
                          >
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SETTINGS CARDS */}
        <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '32px 0 12px' }}>Configurações</h2>
        <div className="settings-grid">
          <SettingCard
            icon={<IconLock />}
            title="Segurança"
            desc="Gerencie permissões e controle de acesso"
          />
          <SettingCard
            icon={<IconGraph />}
            title="Relatórios"
            desc="Visualize estatísticas e métricas"
          />
          <SettingCard
            icon={<IconGear />}
            title="Configurações"
            desc="Ajustes gerais do sistema"
          />
          <SettingCard
            icon={<IconDatabase />}
            title="Backups"
            desc="Gerenciamento de backups e dados"
          />
        </div>
      </main>

      <style>{`
        .app-shell {
          display: flex;
          min-height: 100vh;
        }

        .page-header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .required {
          color: var(--color-danger-fg);
        }

        .form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .card-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border-muted);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          background: var(--color-neutral-muted);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          color: var(--color-fg-muted);
          margin-left: 8px;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-accent-subtle);
          border: 1px solid var(--color-accent-muted);
          color: var(--color-accent-fg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .user-name {
          font-weight: 500;
          color: var(--color-fg-default);
        }

        .text-muted {
          color: var(--color-fg-muted);
        }

        .text-sm {
          font-size: 12px;
        }

        .table-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }

        .btn-xs {
          padding: 3px 10px;
          font-size: 12px;
          line-height: 18px;
        }

        .btn-danger-outline {
          background: transparent;
          border-color: var(--color-border-default);
          color: var(--color-danger-fg);
        }

        .btn-danger-outline:hover:not(:disabled) {
          background: var(--color-danger-subtle);
          border-color: var(--color-danger-muted);
        }

        /* Role badges */
        .role-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid transparent;
        }

        .role-admin {
          background: rgba(139, 92, 246, 0.1);
          color: #a78bfa;
          border-color: rgba(139, 92, 246, 0.2);
        }

        .role-atendimento {
          background: var(--color-accent-subtle);
          color: var(--color-accent-fg);
          border-color: var(--color-accent-muted);
        }

        .role-cliente {
          background: var(--color-neutral-subtle);
          color: var(--color-fg-muted);
          border-color: var(--color-neutral-muted);
        }

        /* Settings */
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .setting-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 6px;
          padding: 16px;
          cursor: pointer;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .setting-card:hover {
          border-color: var(--color-accent-fg);
          box-shadow: var(--color-shadow-medium);
        }

        .setting-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: var(--color-accent-subtle);
          border: 1px solid var(--color-accent-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent-fg);
          flex-shrink: 0;
        }

        .setting-card h3 {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin-bottom: 3px;
        }

        .setting-card p {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 640px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .form-grid-2 .form-group[style*="gridColumn"] {
            grid-column: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}

function SettingCard({ icon, title, desc }) {
  return (
    <div className="setting-card">
      <div className="setting-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  )
}

function AppSidebar({ activePath }) {
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
        <Link href="/" className="sidebar-logout-link">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z" />
          </svg>
          Sair
        </Link>
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
        .sidebar-logout-link {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 6px 8px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-danger-fg);
          text-decoration: none;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          margin-top: 4px;
        }
        .sidebar-logout-link:hover {
          background: var(--color-danger-subtle);
          border-color: var(--color-danger-muted);
          text-decoration: none;
          color: var(--color-danger-fg);
        }
      `}</style>
    </aside>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link href={href} className={`nav-item${active ? ' active' : ''}`}>
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
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

function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25ZM10.5 6V4a2.5 2.5 0 0 0-5 0v2Z" />
    </svg>
  )
}

function IconGraph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z" />
    </svg>
  )
}

function IconDatabase() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1 3.5C1 2.119 4.03 1 8 1s7 1.119 7 2.5v2c0 1.381-3.03 2.5-7 2.5S1 6.881 1 5.5v-2Zm0 4.029C2.853 8.456 5.367 9 8 9s5.147-.544 7-1.471V9.5c0 1.381-3.03 2.5-7 2.5S1 10.881 1 9.5V7.529Zm0 4C2.853 12.456 5.367 13 8 13s5.147-.544 7-1.471v1.971c0 1.381-3.03 2.5-7 2.5S1 14.881 1 13.5v-1.971Z" />
    </svg>
  )
}
