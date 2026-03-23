'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '', telefone: '', endereco: '' })

  const handleAddCliente = (e) => {
    e.preventDefault()
    setClientes([...clientes, { ...formData, id: Date.now() }])
    setFormData({ nome: '', email: '', cnpj: '', telefone: '', endereco: '' })
    setShowForm(false)
    alert('✅ Cliente cadastrado com sucesso!')
  }

  const handleDeleteCliente = (id) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id))
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1>Clientes</h1>
            <p>Gerenciamento completo de clientes white label</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '❌ Cancelar' : '➕ Novo Cliente'}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="card" style={{ marginBottom: '40px' }}>
            <h2>Cadastro de Cliente</h2>
            <form onSubmit={handleAddCliente}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label>Nome da Empresa *</label>
                  <input
                    type="text"
                    placeholder="Ex: Empresa XYZ"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="contato@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CNPJ</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Endereço</label>
                <input
                  type="text"
                  placeholder="Rua, nº, cidade - estado"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CLIENTS LIST */}
        {clientes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏢</div>
            <h3>Nenhum cliente cadastrado</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Clique no botão "➕ Novo Cliente" para adicionar o primeiro cliente
            </p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Criar Primeiro Cliente
            </button>
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Email</th>
                    <th>CNPJ</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.nome}</strong></td>
                      <td>{c.email}</td>
                      <td>{c.cnpj || '—'}</td>
                      <td>{c.telefone || '—'}</td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '5px 10px' }}>
                          ✏️ Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteCliente(c.id)}
                          className="btn btn-danger"
                          style={{ fontSize: '12px', padding: '5px 10px', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                        >
                          🗑️ Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🎯 AprovaAí</h2>

      <nav style={{ marginBottom: '40px' }}>
        <NavLink href="/dashboard" label="Dashboard" icon="📊" />
        <NavLink href="/clientes" label="Clientes" icon="🏢" active />
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" />
        <NavLink href="/calendario" label="Calendário" icon="📅" />
        <NavLink href="/aprovacoes" label="Aprovações" icon="✅" />
        <NavLink href="/admin" label="Administração" icon="⚙️" />
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
        <ThemeToggle />
        <Link href="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
          🚪 Sair
        </Link>
      </div>
    </div>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link href={href} className={`nav-item ${active ? 'active' : ''}`} style={{ justifyContent: 'flex-start' }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <a style={{ flex: 1, textAlign: 'left' }}>{label}</a>
    </Link>
  )
}
