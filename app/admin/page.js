'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Admin() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: 'Admin', email: 'admin@test.com', role: 'admin', status: 'ativo', criadoEm: '2024-03-20' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', role: 'cliente' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!formData.nome.trim() || !formData.email.trim()) {
      alert('Preencha todos os campos')
      return
    }
    setUsuarios([...usuarios, {
      id: Date.now(),
      ...formData,
      status: 'ativo',
      criadoEm: new Date().toISOString().split('T')[0]
    }])
    setFormData({ nome: '', email: '', role: 'cliente' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (confirm('Deletar usuário?')) {
      setUsuarios(usuarios.filter(u => u.id !== id))
    }
  }

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' }
      case 'atendimento': return { bg: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }
      default: return { bg: 'rgba(107, 114, 128, 0.1)', color: '#9ca3af' }
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1>Administração</h1>
            <p>Gerencie usuários, funções e permissões</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '❌ Cancelar' : '➕ Novo Usuário'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '32px' }}>
            <h2>Criar Novo Usuário</h2>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input type="text" placeholder="João Silva" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="joao@empresa.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Função</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="cliente">👤 Cliente</option>
                    <option value="atendimento">💬 Atendimento</option>
                    <option value="admin">👑 Admin</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">💾 Criar</button>
              </div>
            </form>
          </div>
        )}

        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 style={{ marginTop: 0 }}>Usuários ({usuarios.length})</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Status</th>
                <th>Desde</th>
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
                        {u.role === 'admin' ? '👑 Admin' : u.role === 'atendimento' ? '💬 Atendimento' : '👤 Cliente'}
                      </span>
                    </td>
                    <td><span style={{ color: '#10b981', fontWeight: '600' }}>✅ {u.status}</span></td>
                    <td style={{ fontSize: '13px', color: '#cbd5e1' }}>{u.criadoEm}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>✏️ Editar</button>
                      <button onClick={() => handleDelete(u.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>🗑️ Remover</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <h2 style={{ marginTop: '40px' }}>Configurações</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <SettingCard icon="🔒" title="Segurança" desc="Gerenciar permissões" />
          <SettingCard icon="📊" title="Relatórios" desc="Visualizar analytics" />
          <SettingCard icon="⚙️" title="Configurações" desc="Ajustes do sistema" />
          <SettingCard icon="🔄" title="Backups" desc="Gerenciar backups" />
        </div>
      </div>
    </div>
  )
}

function SettingCard({ icon, title, desc }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }}>
      <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{desc}</p>
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
      <Link href="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>🚪 Sair</Link>
    </div>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link href={href} className={`nav-item ${active ? 'active' : ''}`} style={{ justifyContent: 'flex-start' }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <a style={{ flex: 1 }}>{label}</a>
    </Link>
  )
}
