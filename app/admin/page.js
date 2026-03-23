'use client'

import { useState } from 'react'
import Link from 'next/link'

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
    alert('✅ Usuário criado com sucesso!')
  }

  const handleDeleteUser = (id) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      setUsuarios(usuarios.filter(u => u.id !== id))
    }
  }

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', label: '👑 Admin' }
      case 'atendimento': return { bg: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', label: '💬 Atendimento' }
      default: return { bg: 'rgba(107, 114, 128, 0.1)', color: '#9ca3af', label: '👤 Cliente' }
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1>Administração</h1>
            <p>Gerencie usuários, funções e permissões</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '❌ Cancelar' : '➕ Novo Usuário'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '40px' }}>
            <h2>Criar Novo Usuário</h2>
            <form onSubmit={handleAddUser}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    placeholder="João da Silva"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="joao@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Função</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: '12px',
                      color: '#f1f5f9',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="cliente">👤 Cliente</option>
                    <option value="atendimento">💬 Atendimento</option>
                    <option value="admin">👑 Admin</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Criar Usuário
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h2 style={{ margin: '0' }}>Usuários Cadastrados ({usuarios.length})</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => {
                  const roleInfo = getRoleColor(u.role)
                  return (
                    <tr key={u.id}>
                      <td><strong>{u.nome}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span style={{
                          background: roleInfo.bg,
                          color: roleInfo.color,
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-block'
                        }}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>
                          ✅ {u.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: '#cbd5e1' }}>{u.criadoEm}</td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                          ✏️ Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="btn btn-danger"
                          style={{ fontSize: '12px', padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                        >
                          🗑️ Remover
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <SettingCard title="🔒 Segurança" desc="Gerencie permissões e acesso" />
          <SettingCard title="📊 Relatórios" desc="Visualize estatísticas" />
          <SettingCard title="⚙️ Configurações" desc="Ajustes do sistema" />
          <SettingCard title="🔄 Backups" desc="Gerenciamento de backups" />
        </div>
      </div>
    </div>
  )
}

function SettingCard({ title, desc }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px', cursor: 'pointer' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>
        {title.split(' ')[0]}
      </div>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>{title}</h3>
      <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>{desc}</p>
    </div>
  )
}

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🎯 AprovaAí</h2>
      <nav style={{ marginBottom: '40px' }}>
        <NavLink href="/dashboard" label="Dashboard" icon="📊" />
        <NavLink href="/clientes" label="Clientes" icon="🏢" />
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" />
        <NavLink href="/calendario" label="Calendário" icon="📅" />
        <NavLink href="/aprovacoes" label="Aprovações" icon="✅" />
        <NavLink href="/admin" label="Administração" icon="⚙️" active />
      </nav>
      <Link href="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
        🚪 Sair
      </Link>
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
