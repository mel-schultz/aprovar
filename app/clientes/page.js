'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Building2,
  Mail,
  Phone,
  Settings,
  LogOut,
  LayoutDashboard,
  Package,
  Calendar,
  CheckSquare,
} from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'

export default function Clientes() {
  const [clientes, setClientes] = useState([
    { id: 1, nome: 'Empresa ABC', email: 'contato@abc.com', cnpj: '12.345.678/0001-90', telefone: '(11) 3000-0000', status: 'ativo' },
    { id: 2, nome: 'Tech Solutions', email: 'info@techsol.com', cnpj: '98.765.432/0001-10', telefone: '(21) 3000-0000', status: 'ativo' },
    { id: 3, nome: 'Design Studio', email: 'hello@design.com', cnpj: '55.123.456/0001-78', telefone: '(31) 3000-0000', status: 'ativo' },
    { id: 4, nome: 'Marketing Pro', email: 'contact@marketing.com', cnpj: '77.654.321/0001-45', telefone: '(41) 3000-0000', status: 'ativo' },
    { id: 5, nome: 'Web Agency', email: 'info@webagency.com', cnpj: '33.987.654/0001-12', telefone: '(51) 3000-0000', status: 'inativo' },
    { id: 6, nome: 'Consultoria XYZ', email: 'contact@consultoria.com', cnpj: '44.321.987/0001-56', telefone: '(61) 3000-0000', status: 'ativo' },
    { id: 7, nome: 'Startup Inovação', email: 'hello@startup.com', cnpj: '66.456.789/0001-23', telefone: '(71) 3000-0000', status: 'ativo' },
    { id: 8, nome: 'E-commerce Plus', email: 'sales@ecommerce.com', cnpj: '88.789.012/0001-34', telefone: '(81) 3000-0000', status: 'ativo' },
  ])
  const [showModal, setShowModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '', telefone: '', endereco: '', status: 'ativo' })

  const filteredClientes = useMemo(() => {
    return clientes.filter(c => {
      const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cnpj.includes(searchTerm)
      const matchStatus = filterStatus === 'all' || c.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [clientes, searchTerm, filterStatus])

  const handleNewCliente = () => {
    setSelectedCliente(null)
    setFormData({ nome: '', email: '', cnpj: '', telefone: '', endereco: '', status: 'ativo' })
    setShowModal(true)
  }

  const handleEditCliente = (cliente) => {
    setSelectedCliente(cliente)
    setFormData(cliente)
    setShowModal(true)
  }

  const handleSaveCliente = (e) => {
    e.preventDefault()
    if (!formData.nome.trim()) return

    if (selectedCliente) {
      setClientes(clientes.map(c =>
        c.id === selectedCliente.id ? { ...c, ...formData } : c
      ))
    } else {
      setClientes([...clientes, { ...formData, id: Date.now() }])
    }
    setShowModal(false)
    setFormData({ nome: '', email: '', cnpj: '', telefone: '', endereco: '', status: 'ativo' })
  }

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
              <Plus size={14} />
              Novo cliente
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters-bar">
          <div className="search-box">
            <Search size={14} />
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

        {/* CLIENTS GRID - 4 COLUNAS */}
        <div className="grid-4col">
          {filteredClientes.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--color-fg-muted)' }}>
              <p>Nenhum cliente encontrado</p>
            </div>
          ) : (
            filteredClientes.map(cliente => (
              <div
                key={cliente.id}
                className="client-card"
                onClick={() => handleEditCliente(cliente)}
              >
                <div className="client-header">
                  <div className="client-avatar">
                    <Building2 size={20} />
                  </div>
                  <span className={`status-badge ${cliente.status}`}>
                    {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <h3 className="client-name">{cliente.nome}</h3>
                <div className="client-meta">
                  <div className="meta-item">
                    <Mail size={12} />
                    <span className="meta-value">{cliente.email}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">CNPJ:</span>
                    <span className="meta-value code">{cliente.cnpj}</span>
                  </div>
                  <div className="meta-item">
                    <Phone size={12} />
                    <span className="meta-value">{cliente.telefone}</span>
                  </div>
                </div>
                <div className="client-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditCliente(cliente)
                    }}
                    className="btn-icon-small"
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCliente(cliente.id)
                    }}
                    className="btn-icon-small btn-icon-danger"
                    title="Deletar"
                  >
                    <Trash2 size={14} />
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
                <h2>{selectedCliente ? 'Editar cliente' : 'Novo cliente'}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-close"
                  aria-label="Fechar"
                >
                  <X size={20} />
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
        .main-content { flex: 1; padding: 24px; overflow-y: auto; background: var(--color-canvas-default); margin-left: 20px; }
        .required { color: var(--color-danger-fg); }

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

        .page-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
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

        .filter-select {
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          background: var(--color-canvas-default);
          color: var(--color-fg-default);
          cursor: pointer;
        }

        /* Client Card */
        .client-card {
          background: var(--color-canvas-subtle);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .client-card:hover {
          border-color: var(--color-accent-fg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .client-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .client-avatar {
          width: 40px;
          height: 40px;
          background: var(--color-accent-subtle);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent-fg);
        }

        .status-badge {
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

        .client-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        .client-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 8px 0;
          border-top: 1px solid var(--color-border-muted);
          border-bottom: 1px solid var(--color-border-muted);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--color-fg-muted);
        }

        .meta-label {
          font-weight: 600;
          text-transform: uppercase;
        }

        .meta-value {
          color: var(--color-fg-default);
          font-size: 11px;
        }

        .meta-value.code {
          font-family: monospace;
          font-size: 10px;
        }

        .client-actions {
          display: flex;
          gap: 4px;
          justify-content: flex-end;
        }

        .btn-icon-small {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          color: var(--color-fg-muted);
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon-small:hover {
          background: var(--color-accent-subtle);
          color: var(--color-accent-fg);
        }

        .btn-icon-danger:hover {
          background: var(--color-danger-subtle);
          color: var(--color-danger-fg);
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
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          color: var(--color-fg-muted);
          transition: background-color 0.15s ease;
        }

        .modal-close:hover {
          background: var(--color-canvas-subtle);
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

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-primary {
          background: var(--color-accent-fg);
          color: white;
        }

        .btn-primary:hover {
          background: var(--color-accent-emphasis);
        }

        .btn-secondary {
          background: var(--color-canvas-subtle);
          color: var(--color-fg-default);
          border: 1px solid var(--color-border-default);
        }

        .btn-secondary:hover {
          background: var(--color-border-default);
        }

        .btn-danger {
          background: var(--color-danger-subtle);
          color: var(--color-danger-fg);
        }

        .btn-danger:hover {
          background: var(--color-danger-fg);
          color: white;
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

          .form-row {
            grid-template-columns: 1fr;
          }

          .page-header-row {
            flex-direction: column;
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
          <CheckSquare size={18} />
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
          background: var(--color-canvas-default);
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
