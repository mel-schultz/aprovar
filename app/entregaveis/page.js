'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Entregaveis() {
  const [entregaveis, setEntregaveis] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '' })

  const handleAddEntregavel = (e) => {
    e.preventDefault()
    setEntregaveis([...entregaveis, { ...formData, id: Date.now(), status: 'pendente' }])
    setFormData({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '' })
    setShowForm(false)
  }

  const updateStatus = (id, status) => {
    setEntregaveis(entregaveis.map(e => e.id === id ? { ...e, status } : e))
  }

  return (
    <div className="app-shell">
      <AppSidebar activePath="/entregaveis" />

      <main className="main-content">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div className="page-header-row">
            <div>
              <h1>Entregáveis</h1>
              <p>Gerencie todos os seus entregáveis e anexos</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
            >
              {showForm ? 'Cancelar' : (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
                  </svg>
                  Novo entregável
                </>
              )}
            </button>
          </div>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Criar novo entregável</h2>
            <form onSubmit={handleAddEntregavel}>
              <div className="form-group">
                <label htmlFor="titulo">Título <span className="required">*</span></label>
                <input
                  id="titulo"
                  type="text"
                  placeholder="Ex: Design da Landing Page"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  placeholder="Descreva o entregável..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="cliente">Cliente</label>
                  <input
                    id="cliente"
                    type="text"
                    placeholder="Nome do cliente"
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dataEntrega">Data de entrega</label>
                  <input
                    id="dataEntrega"
                    type="date"
                    value={formData.dataEntrega}
                    onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="arquivo">Anexo</label>
                <input
                  id="arquivo"
                  type="file"
                  onChange={(e) => setFormData({ ...formData, arquivo: e.target.files[0]?.name || '' })}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Criar entregável
                </button>
              </div>
            </form>
          </div>
        )}

        {/* DELIVERABLES LIST */}
        {entregaveis.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="m8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.2.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.25.25 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z" />
              </svg>
            </div>
            <h3>Nenhum entregável criado</h3>
            <p>Adicione o primeiro entregável para começar a gerenciar aprovações.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Criar entregável
            </button>
          </div>
        ) : (
          <div className="deliverables-list">
            {entregaveis.map(e => (
              <div key={e.id} className={`deliverable-card deliverable-card--${e.status}`}>
                <div className="deliverable-header">
                  <div className="deliverable-info">
                    <h3 className="deliverable-title">{e.titulo}</h3>
                    <div className="deliverable-meta">
                      {e.cliente && (
                        <span className="meta-item">
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M5.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                          </svg>
                          {e.cliente}
                        </span>
                      )}
                      {e.dataEntrega && (
                        <span className="meta-item">
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0Z" />
                          </svg>
                          {e.dataEntrega}
                        </span>
                      )}
                      {e.arquivo && (
                        <span className="meta-item">
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z" />
                          </svg>
                          {e.arquivo}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`status-badge status-${e.status === 'pendente' ? 'pending' : e.status === 'aprovado' ? 'approved' : 'rejected'}`}>
                    {e.status === 'pendente' ? 'Pendente' : e.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                  </span>
                </div>

                {e.descricao && (
                  <p className="deliverable-desc">{e.descricao}</p>
                )}

                <div className="deliverable-actions">
                  {e.status === 'pendente' && (
                    <>
                      <button
                        onClick={() => updateStatus(e.id, 'aprovado')}
                        className="btn btn-success btn-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                        </svg>
                        Aprovar
                      </button>
                      <button
                        onClick={() => updateStatus(e.id, 'rejeitado')}
                        className="btn btn-danger btn-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                        </svg>
                        Rejeitar
                      </button>
                    </>
                  )}
                  <button className="btn btn-secondary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z" />
                    </svg>
                    Visualizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .app-shell { display: flex; min-height: 100vh; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .form-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 0; }
        .required { color: var(--color-danger-fg); }
        .form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }

        .deliverables-list { display: flex; flex-direction: column; gap: 8px; }

        .deliverable-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 6px;
          padding: 16px;
          border-left: 3px solid var(--color-border-default);
        }

        .deliverable-card--pendente { border-left-color: var(--color-warning-fg); }
        .deliverable-card--aprovado { border-left-color: var(--color-success-fg); }
        .deliverable-card--rejeitado { border-left-color: var(--color-danger-fg); }

        .deliverable-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .deliverable-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin-bottom: 6px;
        }

        .deliverable-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--color-fg-muted);
        }

        .deliverable-desc {
          font-size: 13px;
          color: var(--color-fg-muted);
          margin: 8px 0;
          line-height: 1.5;
        }

        .deliverable-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--color-border-muted);
          flex-wrap: wrap;
        }

        .btn-sm { padding: 4px 12px; font-size: 13px; line-height: 20px; }

        .empty-state { text-align: center; padding: 48px 24px; }
        .empty-state-icon { width: 48px; height: 48px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; background: var(--color-canvas-subtle); border: 1px solid var(--color-border-default); border-radius: 6px; color: var(--color-fg-muted); }
        .empty-state h3 { font-size: 16px; font-weight: 600; color: var(--color-fg-default); margin-bottom: 8px; }
        .empty-state p { font-size: 14px; color: var(--color-fg-muted); margin-bottom: 16px; }

        @media (max-width: 640px) { .form-grid-2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}

function AppSidebar({ activePath }) {
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', d: 'M1 2.75A.75.75 0 0 1 1.75 2h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 1 7.75ZM1.75 12h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5ZM9 2.75A.75.75 0 0 1 9.75 2h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 2.75ZM9.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 7.75.75.75 0 0 1 9.75 7ZM9 12.75A.75.75 0 0 1 9.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 12.75Z' },
    { href: '/clientes', label: 'Clientes', d: 'M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h3.75a.75.75 0 0 1 0 1.5H1.75Z' },
    { href: '/entregaveis', label: 'Entregáveis', d: 'm8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.2.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.25.25 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z' },
    { href: '/calendario', label: 'Calendário', d: 'M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z' },
    { href: '/aprovacoes', label: 'Aprovações', d: 'M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z' },
    { href: '/admin', label: 'Administração', d: 'M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Z' },
  ]

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
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className={`nav-item${activePath === item.href ? ' active' : ''}`}>
            <span className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d={item.d} />
              </svg>
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <ThemeToggle />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: 'var(--color-danger-fg)', textDecoration: 'none', marginTop: '4px' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z" />
          </svg>
          Sair
        </Link>
      </div>
    </aside>
  )
}
