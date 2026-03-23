'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ThemeToggle from '../../components/ThemeToggle'

const STATUS_CONFIG = {
  pendente:  { color: '#fed7aa', textColor: '#92400e', label: 'Pendente',    icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 3.25a.75.75 0 0 1 .75.75v4.25h2.5a.75.75 0 0 1 0 1.5h-3.25a.75.75 0 0 1-.75-.75V4a.75.75 0 0 1 .75-.75z"/></svg> },
  emRevisao: { color: '#bfdbfe', textColor: '#1e40af', label: 'Em Revisão',  icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 2a5.97 5.97 0 0 0-4.546 2.072L2.25 2.75A.75.75 0 0 0 1 3.25v3.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .53-1.28L4.31 4.75A4.5 4.5 0 1 1 8 12.5a.75.75 0 0 0 0 1.5A6 6 0 1 0 8 2zm.75 3.75a.75.75 0 0 0-1.5 0V8c0 .199.079.39.22.53l1.5 1.5a.75.75 0 1 0 1.06-1.06L8.75 7.689V5.75z"/></svg> },
  aprovado:  { color: '#d1fae5', textColor: '#065f46', label: 'Aprovado',    icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> },
  rejeitado: { color: '#fee2e2', textColor: '#991b1b', label: 'Rejeitado',   icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg> },
}

export default function Entregaveis() {
  const [entregaveis, setEntregaveis] = useState([
    { id: 1, titulo: 'Design da Landing Page',  cliente: 'Empresa ABC',      status: 'aprovado',  dataEntrega: '2024-03-25', descricao: 'Design completo da landing page',        arquivo: 'landing-page.pdf'   },
    { id: 2, titulo: 'Protótipos Mobile',        cliente: 'Tech Solutions',   status: 'emRevisao', dataEntrega: '2024-03-28', descricao: 'Protótipos interativos mobile',          arquivo: 'prototipos-mobile.fig' },
    { id: 3, titulo: 'Documentação API',         cliente: 'Empresa ABC',      status: 'pendente',  dataEntrega: '2024-03-30', descricao: 'Documentação completa da API',           arquivo: 'api-docs.md'        },
    { id: 4, titulo: 'Wireframes Desktop',       cliente: 'Design Studio',    status: 'aprovado',  dataEntrega: '2024-03-22', descricao: 'Wireframes de todas as páginas',         arquivo: 'wireframes.fig'     },
    { id: 5, titulo: 'Guia de Estilo',           cliente: 'Marketing Pro',    status: 'pendente',  dataEntrega: '2024-04-01', descricao: 'Guia completo de marca',                 arquivo: 'style-guide.pdf'    },
    { id: 6, titulo: 'Vídeo Explicativo',        cliente: 'Web Agency',       status: 'rejeitado', dataEntrega: '2024-03-20', descricao: 'Vídeo de apresentação do produto',       arquivo: 'video.mp4'          },
    { id: 7, titulo: 'Mockups Finais',           cliente: 'Consultoria XYZ',  status: 'emRevisao', dataEntrega: '2024-03-29', descricao: 'Mockups em alta fidelidade',             arquivo: 'mockups.fig'        },
    { id: 8, titulo: 'Apresentação Executiva',   cliente: 'Startup Inovação', status: 'aprovado',  dataEntrega: '2024-03-26', descricao: 'Apresentação para stakeholders',         arquivo: 'apresentacao.pptx'  },
  ])
  const [showModal, setShowModal]               = useState(false)
  const [selectedEntregavel, setSelectedEntregavel] = useState(null)
  const [filterStatus, setFilterStatus]         = useState('all')
  const [searchTerm, setSearchTerm]             = useState('')
  const [formData, setFormData]                 = useState({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '', status: 'pendente' })

  const filteredEntregaveis = useMemo(() => {
    return entregaveis.filter(e => {
      const matchSearch = e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = filterStatus === 'all' || e.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [entregaveis, searchTerm, filterStatus])

  const handleNewEntregavel = () => {
    setSelectedEntregavel(null)
    setFormData({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '', status: 'pendente' })
    setShowModal(true)
  }

  const handleEditEntregavel = (entregavel) => {
    setSelectedEntregavel(entregavel)
    setFormData(entregavel)
    setShowModal(true)
  }

  const handleSaveEntregavel = (e) => {
    e.preventDefault()
    if (!formData.titulo.trim()) return
    if (selectedEntregavel) {
      setEntregaveis(entregaveis.map(en => en.id === selectedEntregavel.id ? { ...en, ...formData } : en))
    } else {
      setEntregaveis([...entregaveis, { ...formData, id: Date.now() }])
    }
    setShowModal(false)
    setFormData({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '', status: 'pendente' })
  }

  const handleDeleteEntregavel = (entregavelId) => {
    if (confirm('Tem certeza que deseja remover este entregável?')) {
      setEntregaveis(entregaveis.filter(en => en.id !== entregavelId))
      setShowModal(false)
    }
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
              <p>Gerencie todos os arquivos e projetos entregues</p>
            </div>
            <button onClick={handleNewEntregavel} className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
              </svg>
              Novo entregável
            </button>
          </div>
        </div>

        {/* FILTERS */}
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="emRevisao">Em Revisão</option>
            <option value="aprovado">Aprovado</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
        </div>

        {/* DELIVERABLES GRID */}
        <div className="grid-4col">
          {filteredEntregaveis.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--color-fg-muted)' }}>
              <p>Nenhum entregável encontrado</p>
            </div>
          ) : (
            filteredEntregaveis.map(entregavel => (
              <div
                key={entregavel.id}
                className="deliverable-card"
                onClick={() => handleEditEntregavel(entregavel)}
              >
                <div className="deliverable-status-bar" style={{ background: STATUS_CONFIG[entregavel.status]?.color }} />
                <div className="deliverable-header">
                  <span
                    className="status-badge"
                    style={{
                      background: STATUS_CONFIG[entregavel.status]?.color,
                      color: STATUS_CONFIG[entregavel.status]?.textColor,
                    }}
                  >
                    {STATUS_CONFIG[entregavel.status]?.icon}
                    {STATUS_CONFIG[entregavel.status]?.label}
                  </span>
                </div>
                <h3 className="deliverable-title">{entregavel.titulo}</h3>
                <p className="deliverable-description">{entregavel.descricao}</p>
                <div className="deliverable-meta">
                  <div className="meta-item">
                    <span className="meta-label">Cliente:</span>
                    <span className="meta-value">{entregavel.cliente}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Entrega:</span>
                    <span className="meta-value">{new Date(entregavel.dataEntrega).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Arquivo:</span>
                    <span className="meta-value code">{entregavel.arquivo}</span>
                  </div>
                </div>
                <div className="deliverable-actions">
                  {/* Botão Editar — SVG lápis */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditEntregavel(entregavel) }}
                    className="btn-icon-small"
                    title="Editar"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354l-1.086-1.086zM11.189 6.25 9.75 4.81l-6.286 6.287a.25.25 0 0 0-.064.108l-.558 1.953 1.953-.558a.249.249 0 0 0 .108-.064l6.286-6.286z"/>
                    </svg>
                  </button>
                  {/* Botão Deletar — SVG lixeira */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteEntregavel(entregavel.id) }}
                    className="btn-icon-small btn-icon-danger"
                    title="Deletar"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"/>
                    </svg>
                  </button>
                </div>
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
                {/* Botão fechar — SVG X */}
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-close"
                  aria-label="Fechar"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveEntregavel}>
                <div className="form-row">
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

                <div className="form-group">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
                    placeholder="Descreva o entregável..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows="4"
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
        .main-content { flex: 1; padding: 24px; overflow-y: auto; background: var(--color-canvas-default); }
        .required { color: var(--color-danger-fg); }

        .grid-4col {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

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

        .search-input::placeholder { color: var(--color-fg-muted); }

        .filter-select {
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          background: var(--color-canvas-default);
          color: var(--color-fg-default);
          cursor: pointer;
        }

        .deliverable-card {
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

        .deliverable-card:hover {
          border-color: var(--color-accent-fg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .deliverable-status-bar { height: 4px; width: 100%; }

        .deliverable-header {
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

        .deliverable-title {
          padding: 0 16px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        .deliverable-description {
          padding: 0 16px;
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 0;
          line-height: 1.4;
        }

        .deliverable-meta {
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

        .meta-value.code { font-family: monospace; font-size: 10px; }

        .deliverable-actions {
          display: flex;
          gap: 4px;
          justify-content: flex-end;
          padding: 0 16px 12px;
        }

        .btn-icon-small {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 5px 7px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--color-fg-muted);
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .btn-icon-small:hover {
          background: var(--hover-bg);
          color: var(--color-fg-default);
        }

        .btn-icon-danger:hover {
          background: var(--color-danger-subtle);
          color: var(--color-danger-fg);
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
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
          color: var(--color-fg-muted);
          cursor: pointer;
          padding: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .modal-close:hover {
          background: var(--hover-bg);
          color: var(--color-fg-default);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .form-group { display: flex; flex-direction: column; gap: 6px; }

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

        .form-group textarea { resize: vertical; min-height: 100px; }

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

        @media (max-width: 1400px) { .grid-4col { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 1024px) { .grid-4col { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) {
          .grid-4col { grid-template-columns: 1fr; }
          .filters-bar { flex-direction: column; }
          .search-box { flex: 1; min-width: auto; }
          .form-row { grid-template-columns: 1fr; }
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
        <NavLink href="/dashboard"   label="Dashboard"     icon="dashboard" active={activePath === '/dashboard'}   />
        <NavLink href="/clientes"    label="Clientes"      icon="building"  active={activePath === '/clientes'}    />
        <NavLink href="/entregaveis" label="Entregáveis"   icon="package"   active={activePath === '/entregaveis'} />
        <NavLink href="/calendario"  label="Calendário"    icon="calendar"  active={activePath === '/calendario'}  />
        <NavLink href="/aprovacoes"  label="Aprovações"    icon="check"     active={activePath === '/aprovacoes'}  />
        <NavLink href="/admin"       label="Administração" icon="gear"      active={activePath === '/admin'}       />
      </nav>
      <div className="sidebar-footer">
        <ThemeToggle />
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: 'var(--color-danger-fg)', textDecoration: 'none', marginTop: '4px', transition: 'background-color 0.15s ease' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
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
        .sidebar-header { padding: 16px 0; border-bottom: 1px solid var(--color-border-muted); }
        .sidebar nav { flex: 1; padding: 8px; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-footer { padding: 12px 8px; border-top: 1px solid var(--color-border-muted); display: flex; flex-direction: column; gap: 4px; }
        .nav-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; color: var(--color-fg-muted); text-decoration: none; transition: background-color 0.15s ease, color 0.15s ease; }
        .nav-item:hover { background: var(--hover-bg); color: var(--color-fg-default); }
        .nav-item.active { background: var(--color-accent-subtle); color: var(--color-accent-fg); }
        .nav-icon { width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 768px) { .sidebar { width: 200px; } }
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
