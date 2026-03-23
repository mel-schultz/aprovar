'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ThemeToggle from '../../components/ThemeToggle'

const APPROVAL_STATUS = {
  pendente: { color: '#fed7aa', textColor: '#92400e', label: 'Pendente', icon: '⏳' },
  aprovado: { color: '#d1fae5', textColor: '#065f46', label: 'Aprovado', icon: '✓' },
  rejeitado: { color: '#fee2e2', textColor: '#991b1b', label: 'Rejeitado', icon: '✕' },
}

export default function Aprovacoes() {
  const [aprovacoes, setAprovacoes] = useState([
    { id: 1, titulo: 'Logo Design v2', cliente: 'Empresa X', dataEnvio: '2024-03-20', status: 'pendente', descricao: 'Revisão de logo para marca' },
    { id: 2, titulo: 'Website Homepage', cliente: 'Empresa Y', dataEnvio: '2024-03-19', status: 'pendente', descricao: 'Design responsivo da homepage' },
    { id: 3, titulo: 'Mobile App Design', cliente: 'Empresa Z', dataEnvio: '2024-03-18', status: 'aprovado', descricao: 'Prototipagem mobile' },
    { id: 4, titulo: 'Branding Guide', cliente: 'Empresa X', dataEnvio: '2024-03-17', status: 'rejeitado', descricao: 'Guia de marca completo' },
    { id: 5, titulo: 'UI Components', cliente: 'Tech Corp', dataEnvio: '2024-03-21', status: 'pendente', descricao: 'Biblioteca de componentes UI' },
    { id: 6, titulo: 'Landing Page', cliente: 'Startup ABC', dataEnvio: '2024-03-16', status: 'aprovado', descricao: 'Design da página de destino' },
    { id: 7, titulo: 'Email Templates', cliente: 'Marketing Inc', dataEnvio: '2024-03-15', status: 'rejeitado', descricao: 'Templates de email marketing' },
    { id: 8, titulo: 'Dashboard Mockup', cliente: 'Analytics Pro', dataEnvio: '2024-03-22', status: 'pendente', descricao: 'Mockup do painel de controle' },
  ])
  const [filterStatus, setFilterStatus] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedAprovacao, setSelectedAprovacao] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const filteredAprovacoes = useMemo(() => {
    return aprovacoes.filter(a => {
      const matchSearch = a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = filterStatus === 'todos' || a.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [aprovacoes, searchTerm, filterStatus])

  const statusCounts = useMemo(() => {
    const counts = { todos: aprovacoes.length, pendente: 0, aprovado: 0, rejeitado: 0 }
    aprovacoes.forEach(a => {
      if (counts[a.status] !== undefined) counts[a.status]++
    })
    return counts
  }, [aprovacoes])

  const handleApprove = (id) => {
    setAprovacoes(aprovacoes.map(a => a.id === id ? { ...a, status: 'aprovado' } : a))
    setShowModal(false)
    setSelectedAprovacao(null)
    setRejectReason('')
  }

  const handleReject = (id, reason) => {
    if (!reason.trim()) return
    setAprovacoes(aprovacoes.map(a => a.id === id ? { ...a, status: 'rejeitado' } : a))
    setShowModal(false)
    setSelectedAprovacao(null)
    setRejectReason('')
  }

  const handleOpenModal = (aprovacao) => {
    setSelectedAprovacao(aprovacao)
    setRejectReason('')
    setShowModal(true)
  }

  return (
    <div className="app-shell">
      <AppSidebar activePath="/aprovacoes" />

      <main className="main-content">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div>
            <h1>Aprovações</h1>
            <p>Revise e aprove os entregáveis dos projetos</p>
          </div>
        </div>

        {/* STATUS TABS */}
        <div className="status-tabs">
          {['todos', 'pendente', 'aprovado', 'rejeitado'].map(status => (
            <button
              key={status}
              className={`tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'todos' && `Todos (${statusCounts.todos})`}
              {status === 'pendente' && `Pendentes (${statusCounts.pendente})`}
              {status === 'aprovado' && `Aprovados (${statusCounts.aprovado})`}
              {status === 'rejeitado' && `Rejeitados (${statusCounts.rejeitado})`}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="filters-bar">
          <div className="search-box">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M6.5 1a5.5 5.5 0 014.384 8.823l5.147 5.147a.75.75 0 01-1.06 1.06l-5.147-5.147A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por título ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* APPROVALS GRID - 4 COLUNAS */}
        <div className="grid-4col">
          {filteredAprovacoes.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--color-fg-muted)' }}>
              <p>Nenhuma aprovação encontrada</p>
            </div>
          ) : (
            filteredAprovacoes.map(aprovacao => (
              <div
                key={aprovacao.id}
                className="approval-card"
                onClick={() => handleOpenModal(aprovacao)}
              >
                <div className="approval-status-bar" style={{ background: APPROVAL_STATUS[aprovacao.status]?.color }} />
                <div className="approval-header">
                  <span
                    className="status-badge"
                    style={{
                      background: APPROVAL_STATUS[aprovacao.status]?.color,
                      color: APPROVAL_STATUS[aprovacao.status]?.textColor,
                    }}
                  >
                    {APPROVAL_STATUS[aprovacao.status]?.icon} {APPROVAL_STATUS[aprovacao.status]?.label}
                  </span>
                </div>
                <h3 className="approval-title">{aprovacao.titulo}</h3>
                <p className="approval-description">{aprovacao.descricao}</p>
                <div className="approval-meta">
                  <div className="meta-item">
                    <span className="meta-label">Cliente:</span>
                    <span className="meta-value">{aprovacao.cliente}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Enviado:</span>
                    <span className="meta-value">{new Date(aprovacao.dataEnvio).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                {aprovacao.status === 'pendente' && (
                  <div className="approval-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApprove(aprovacao.id)
                      }}
                      className="btn-action btn-approve"
                      title="Aprovar"
                    >
                      ✓ Aprovar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenModal(aprovacao)
                      }}
                      className="btn-action btn-reject"
                      title="Rejeitar"
                    >
                      ✕ Rejeitar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {showModal && selectedAprovacao && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Revisar Aprovação</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-close"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>

              <div className="approval-details">
                <div className="detail-item">
                  <span className="detail-label">Título:</span>
                  <span className="detail-value">{selectedAprovacao.titulo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Cliente:</span>
                  <span className="detail-value">{selectedAprovacao.cliente}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Descrição:</span>
                  <span className="detail-value">{selectedAprovacao.descricao}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Data de Envio:</span>
                  <span className="detail-value">{new Date(selectedAprovacao.dataEnvio).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status Atual:</span>
                  <span
                    className="status-badge"
                    style={{
                      background: APPROVAL_STATUS[selectedAprovacao.status]?.color,
                      color: APPROVAL_STATUS[selectedAprovacao.status]?.textColor,
                    }}
                  >
                    {APPROVAL_STATUS[selectedAprovacao.status]?.label}
                  </span>
                </div>
              </div>

              {selectedAprovacao.status === 'pendente' && (
                <div className="form-group">
                  <label htmlFor="rejectReason">Motivo da Rejeição (se aplicável)</label>
                  <textarea
                    id="rejectReason"
                    placeholder="Explique por que está rejeitando este item..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows="4"
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Fechar
                </button>
                {selectedAprovacao.status === 'pendente' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReject(selectedAprovacao.id, rejectReason)}
                      className="btn btn-danger"
                    >
                      Rejeitar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedAprovacao.id)}
                      className="btn btn-success"
                    >
                      Aprovar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .app-shell { display: flex; min-height: 100vh; }
        .main-content { flex: 1; padding: 24px; overflow-y: auto; background: var(--color-canvas-default); }

        /* Status Tabs */
        .status-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--color-border-muted);
          overflow-x: auto;
        }

        .tab {
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-fg-muted);
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .tab:hover {
          color: var(--color-fg-default);
        }

        .tab.active {
          color: var(--color-accent-fg);
          border-bottom-color: var(--color-accent-fg);
        }

        /* Grid Layout - 4 Colunas */
        .grid-4col {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        /* Filters Bar */
        .filters-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 200px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          color: var(--color-fg-muted);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px 0;
          font-size: 13px;
          color: var(--color-fg-default);
          outline: none;
        }

        .search-input::placeholder {
          color: var(--color-fg-muted);
        }

        /* Approval Card */
        .approval-card {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .approval-card:hover {
          border-color: var(--color-accent-fg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .approval-status-bar {
          height: 4px;
          width: 100%;
        }

        .approval-header {
          padding: 0 16px;
          padding-top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .approval-title {
          padding: 0 16px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        .approval-description {
          padding: 0 16px;
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 0;
          line-height: 1.4;
        }

        .approval-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 16px;
          padding-bottom: 8px;
          border-top: 1px solid var(--color-border-muted);
          border-bottom: 1px solid var(--color-border-muted);
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          gap: 8px;
        }

        .meta-label {
          color: var(--color-fg-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .meta-value {
          color: var(--color-fg-default);
          font-weight: 500;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .approval-actions {
          display: flex;
          gap: 6px;
          padding: 0 16px 12px;
        }

        .btn-action {
          flex: 1;
          padding: 6px 8px;
          font-size: 11px;
          font-weight: 600;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-approve {
          background: #d1fae5;
          color: #065f46;
        }

        .btn-approve:hover {
          background: #a7f3d0;
        }

        .btn-reject {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-reject:hover {
          background: #fecaca;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 24px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .modal-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        .modal-close {
          background: transparent;
          border: none;
          font-size: 24px;
          color: var(--color-fg-muted);
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: background-color 0.15s ease;
        }

        .modal-close:hover {
          background: var(--hover-bg);
        }

        .approval-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
          padding: 16px;
          background: var(--color-canvas-subtle);
          border-radius: 6px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          font-size: 13px;
        }

        .detail-label {
          font-weight: 600;
          color: var(--color-fg-muted);
          min-width: 100px;
        }

        .detail-value {
          color: var(--color-fg-default);
          text-align: right;
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-fg-default);
        }

        .form-group textarea {
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          background: var(--color-canvas-default);
          color: var(--color-fg-default);
          font-family: inherit;
          resize: vertical;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-accent-fg);
          box-shadow: 0 0 0 3px var(--color-accent-subtle);
        }

        .form-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--color-border-muted);
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

          .status-tabs {
            flex-wrap: wrap;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-box {
            flex: 1;
            min-width: auto;
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
