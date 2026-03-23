'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ThemeToggle from '../../components/ThemeToggle'

const STATUS_CONFIG = {
  pendente: { color: '#fed7aa', textColor: '#92400e', label: 'Pendente', icon: '⏳' },
  emRevisao: { color: '#bfdbfe', textColor: '#1e40af', label: 'Em Revisão', icon: '👁️' },
  aprovado: { color: '#d1fae5', textColor: '#065f46', label: 'Aprovado', icon: '✓' },
  rejeitado: { color: '#fee2e2', textColor: '#991b1b', label: 'Rejeitado', icon: '✕' },
}

export default function Entregaveis() {
  const [entregaveis, setEntregaveis] = useState([
    { id: 1, titulo: 'Design da Landing Page', cliente: 'Empresa ABC', status: 'aprovado', dataEntrega: '2024-03-25', descricao: 'Design completo da landing page', arquivo: 'landing-page.pdf' },
    { id: 2, titulo: 'Protótipos Mobile', cliente: 'Tech Solutions', status: 'emRevisao', dataEntrega: '2024-03-28', descricao: 'Protótipos interativos mobile', arquivo: 'prototipos-mobile.fig' },
    { id: 3, titulo: 'Documentação API', cliente: 'Empresa ABC', status: 'pendente', dataEntrega: '2024-03-30', descricao: 'Documentação completa da API', arquivo: 'api-docs.md' },
  ])
  const [showModal, setShowModal] = useState(false)
  const [selectedEntregavel, setSelectedEntregavel] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '', status: 'pendente' })

  // Filtrar entregáveis
  const filteredEntregaveis = useMemo(() => {
    return entregaveis.filter(e => {
      const matchSearch = e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = filterStatus === 'all' || e.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [entregaveis, searchTerm, filterStatus])

  // Abrir modal para novo entregável
  const handleNewEntregavel = () => {
    setSelectedEntregavel(null)
    setFormData({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '', status: 'pendente' })
    setShowModal(true)
  }

  // Abrir modal para editar entregável
  const handleEditEntregavel = (entregavel) => {
    setSelectedEntregavel(entregavel)
    setFormData(entregavel)
    setShowModal(true)
  }

  // Salvar entregável
  const handleSaveEntregavel = (e) => {
    e.preventDefault()
    if (!formData.titulo.trim()) return

    if (selectedEntregavel) {
      setEntregaveis(entregaveis.map(en =>
        en.id === selectedEntregavel.id ? { ...en, ...formData } : en
      ))
    } else {
      setEntregaveis([...entregaveis, { ...formData, id: Date.now() }])
    }
    setShowModal(false)
    setFormData({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '', status: 'pendente' })
  }

  // Deletar entregável
  const handleDeleteEntregavel = (entregavelId) => {
    if (confirm('Tem certeza que deseja remover este entregável?')) {
      setEntregaveis(entregaveis.filter(e => e.id !== entregavelId))
      setShowModal(false)
    }
  }

  // Contar por status
  const statusCounts = useMemo(() => {
    const counts = { all: entregaveis.length, pendente: 0, emRevisao: 0, aprovado: 0, rejeitado: 0 }
    entregaveis.forEach(e => {
      if (counts[e.status] !== undefined) counts[e.status]++
    })
    return counts
  }, [entregaveis])

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
            <button onClick={handleNewEntregavel} className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
              </svg>
              Novo entregável
            </button>
          </div>
        </div>

        {/* STATUS CARDS */}
        <div className="status-cards-grid">
          {['all', 'pendente', 'emRevisao', 'aprovado', 'rejeitado'].map(status => (
            <div
              key={status}
              className={`status-card${filterStatus === status ? ' active' : ''}`}
              onClick={() => setFilterStatus(status)}
              style={{
                cursor: 'pointer',
                background: filterStatus === status ? 'var(--color-accent-subtle)' : 'var(--color-canvas-default)',
                borderColor: filterStatus === status ? 'var(--color-accent-fg)' : 'var(--color-border-default)',
              }}
            >
              <div className="status-card-label">
                {status === 'all' ? 'Todos' : STATUS_CONFIG[status]?.label}
              </div>
              <div className="status-card-count">
                {statusCounts[status]}
              </div>
            </div>
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

        {/* ENTREGAVEIS GRID */}
        <div className="entregaveis-grid">
          {filteredEntregaveis.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5 }}>
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
              <p>Nenhum entregável encontrado</p>
            </div>
          ) : (
            filteredEntregaveis.map(entregavel => (
              <div
                key={entregavel.id}
                className="entregavel-card"
                onClick={() => handleEditEntregavel(entregavel)}
              >
                <div className="entregavel-header">
                  <h3>{entregavel.titulo}</h3>
                  <span
                    className="status-badge"
                    style={{
                      background: STATUS_CONFIG[entregavel.status]?.color,
                      color: STATUS_CONFIG[entregavel.status]?.textColor,
                    }}
                  >
                    {STATUS_CONFIG[entregavel.status]?.icon} {STATUS_CONFIG[entregavel.status]?.label}
                  </span>
                </div>
                <p className="entregavel-desc">{entregavel.descricao}</p>
                <div className="entregavel-meta">
                  <div className="meta-item">
                    <span className="meta-label">Cliente:</span>
                    <span className="meta-value">{entregavel.cliente}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Entrega:</span>
                    <span className="meta-value">{new Date(entregavel.dataEntrega).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                {entregavel.arquivo && (
                  <div className="entregavel-file">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5c.966 0 1.75.784 1.75 1.75v12.5A1.75 1.75 0 0 1 12.25 16h-8.5A1.75 1.75 0 0 1 2 14.25Zm1.5 0v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Z" />
                    </svg>
                    {entregavel.arquivo}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedEntregavel ? 'Editar entregável' : 'Novo entregável'}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-close"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEntregavel}>
                <div className="form-group">
                  <label htmlFor="titulo">Título <span className="required">*</span></label>
                  <input
                    id="titulo"
                    type="text"
                    placeholder="Ex: Design da Landing Page"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cliente">Cliente</label>
                    <input
                      id="cliente"
                      type="text"
                      placeholder="Ex: Empresa ABC"
                      value={formData.cliente}
                      onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dataEntrega">Data de Entrega</label>
                    <input
                      id="dataEntrega"
                      type="date"
                      value={formData.dataEntrega}
                      onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="arquivo">Arquivo</label>
                    <input
                      id="arquivo"
                      type="text"
                      placeholder="Ex: documento.pdf"
                      value={formData.arquivo}
                      onChange={(e) => setFormData({ ...formData, arquivo: e.target.value })}
                    />
                  </div>
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

                <div className="form-actions">
                  {selectedEntregavel && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEntregavel(selectedEntregavel.id)}
                      className="btn btn-danger"
                    >
                      Deletar
                    </button>
                  )}
                  <div style={{ flex: 1 }} />
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedEntregavel ? 'Atualizar' : 'Criar'} entregável
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .app-shell { display: flex; min-height: 100vh; }
        .required { color: var(--color-danger-fg); }

        /* Status Cards */
        .status-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .status-card {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .status-card:hover {
          border-color: var(--color-border-muted);
        }

        .status-card.active {
          background: var(--color-accent-subtle);
          border-color: var(--color-accent-fg);
        }

        .status-card-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--color-fg-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .status-card-count {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-fg-default);
        }

        /* Filters */
        .filters-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-box {
          flex: 1;
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

        /* Entregaveis Grid */
        .entregaveis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: var(--color-fg-muted);
          text-align: center;
        }

        .empty-state p {
          margin-top: 12px;
          font-size: 14px;
        }

        .entregavel-card {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .entregavel-card:hover {
          border-color: var(--color-accent-fg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .entregavel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .entregavel-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
          flex: 1;
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
          flex-shrink: 0;
        }

        .entregavel-desc {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 0;
          line-height: 1.4;
        }

        .entregavel-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 8px 0;
          border-top: 1px solid var(--color-border-muted);
          border-bottom: 1px solid var(--color-border-muted);
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .meta-label {
          color: var(--color-fg-muted);
          font-weight: 500;
        }

        .meta-value {
          color: var(--color-fg-default);
          font-weight: 500;
        }

        .entregavel-file {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--color-accent-fg);
          background: var(--color-accent-subtle);
          padding: 6px 8px;
          border-radius: 4px;
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .form-row .form-group {
          margin-bottom: 0;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-fg-default);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          background: var(--color-canvas-default);
          color: var(--color-fg-default);
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
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

        @media (max-width: 768px) {
          .entregaveis-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .status-cards-grid {
            grid-template-columns: repeat(2, 1fr);
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
