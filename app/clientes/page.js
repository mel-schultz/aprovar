'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ThemeToggle from '../../components/ThemeToggle'

export default function Clientes() {
  const [clientes, setClientes] = useState([
    { id: 1, nome: 'Empresa ABC', email: 'contato@abc.com', cnpj: '12.345.678/0001-90', telefone: '(11) 3000-0000', status: 'ativo', avatar: '🏢' },
    { id: 2, nome: 'Tech Solutions', email: 'info@techsol.com', cnpj: '98.765.432/0001-10', telefone: '(21) 3000-0000', status: 'ativo', avatar: '💻' },
  ])
  const [showModal, setShowModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '', telefone: '', endereco: '', status: 'ativo' })

  // Filtrar clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter(c => {
      const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cnpj.includes(searchTerm)
      const matchStatus = filterStatus === 'all' || c.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [clientes, searchTerm, filterStatus])

  // Abrir modal para novo cliente
  const handleNewCliente = () => {
    setSelectedCliente(null)
    setFormData({ nome: '', email: '', cnpj: '', telefone: '', endereco: '', status: 'ativo' })
    setShowModal(true)
  }

  // Abrir modal para editar cliente
  const handleEditCliente = (cliente) => {
    setSelectedCliente(cliente)
    setFormData(cliente)
    setShowModal(true)
  }

  // Salvar cliente
  const handleSaveCliente = (e) => {
    e.preventDefault()
    if (!formData.nome.trim()) return

    if (selectedCliente) {
      // Editar cliente existente
      setClientes(clientes.map(c =>
        c.id === selectedCliente.id ? { ...c, ...formData } : c
      ))
    } else {
      // Criar novo cliente
      setClientes([...clientes, { ...formData, id: Date.now(), avatar: '🏢' }])
    }
    setShowModal(false)
    setFormData({ nome: '', email: '', cnpj: '', telefone: '', endereco: '', status: 'ativo' })
  }

  // Deletar cliente
  const handleDeleteCliente = (clienteId) => {
    if (confirm('Tem certeza que deseja remover este cliente?')) {
      setClientes(clientes.filter(c => c.id !== clienteId))
      setShowModal(false)
    }
  }

  return (
    <div className="app-shell">
      <AppSidebar activePath="/clientes" />

      <main className="main-content">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div className="page-header-row">
            <div>
              <h1>Clientes</h1>
              <p>Gerenciamento completo de clientes white label</p>
            </div>
            <button onClick={handleNewCliente} className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
              </svg>
              Novo cliente
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
              placeholder="Buscar por nome, email ou CNPJ..."
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
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>CNPJ</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-fg-muted)' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, margin: '0 auto 12px' }}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8M12 8v8" />
                      </svg>
                      <p>Nenhum cliente encontrado</p>
                    </td>
                  </tr>
                ) : (
                  filteredClientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td>
                        <div className="client-cell">
                          <span className="client-avatar">{cliente.avatar}</span>
                          <span className="client-name">{cliente.nome}</span>
                        </div>
                      </td>
                      <td>{cliente.email}</td>
                      <td><code className="code-text">{cliente.cnpj}</code></td>
                      <td>{cliente.telefone}</td>
                      <td>
                        <span className={`status-badge ${cliente.status}`}>
                          {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleEditCliente(cliente)}
                          className="btn-icon-small"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteCliente(cliente.id)}
                          className="btn-icon-small btn-icon-danger"
                          title="Deletar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span className="table-info">{filteredClientes.length} cliente(s) encontrado(s)</span>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedCliente ? 'Editar cliente' : 'Novo cliente'}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-close"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCliente}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nome">Nome <span className="required">*</span></label>
                    <input
                      id="nome"
                      type="text"
                      placeholder="Ex: Empresa ABC"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="contato@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cnpj">CNPJ</label>
                    <input
                      id="cnpj"
                      type="text"
                      placeholder="12.345.678/0001-90"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input
                      id="telefone"
                      type="tel"
                      placeholder="(11) 3000-0000"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endereco">Endereço</label>
                    <input
                      id="endereco"
                      type="text"
                      placeholder="Rua, número, cidade"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  {selectedCliente && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCliente(selectedCliente.id)}
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
                    {selectedCliente ? 'Atualizar' : 'Criar'} cliente
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

        .filter-select {
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          background: var(--color-canvas-default);
          color: var(--color-fg-default);
          cursor: pointer;
        }

        /* Table */
        .card {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .data-table thead {
          background: var(--color-canvas-subtle);
          border-bottom: 1px solid var(--color-border-muted);
        }

        .data-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: var(--color-fg-muted);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.04em;
        }

        .data-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border-muted);
          color: var(--color-fg-default);
        }

        .data-table tbody tr:hover {
          background: var(--hover-bg);
        }

        .data-table tbody tr:last-child td {
          border-bottom: none;
        }

        .client-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .client-avatar {
          font-size: 18px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-accent-subtle);
          border-radius: 6px;
        }

        .client-name {
          font-weight: 500;
          color: var(--color-fg-default);
        }

        .code-text {
          background: var(--color-canvas-subtle);
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 12px;
          color: var(--color-fg-muted);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.ativo {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.inativo {
          background: #fee2e2;
          color: #991b1b;
        }

        .table-footer {
          padding: 12px 16px;
          background: var(--color-canvas-subtle);
          border-top: 1px solid var(--color-border-muted);
          font-size: 12px;
          color: var(--color-fg-muted);
        }

        .table-info {
          font-weight: 500;
        }

        .btn-icon-small {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.15s ease;
          margin: 0 2px;
        }

        .btn-icon-small:hover {
          background: var(--hover-bg);
        }

        .btn-icon-danger:hover {
          background: var(--color-danger-subtle);
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
        }

        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-fg-default);
        }

        .form-group input,
        .form-group select {
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          background: var(--color-canvas-default);
          color: var(--color-fg-default);
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus {
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
          .filters-bar {
            flex-direction: column;
          }

          .search-box {
            flex: 1;
            min-width: auto;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .data-table {
            font-size: 12px;
          }

          .data-table th,
          .data-table td {
            padding: 8px 12px;
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
