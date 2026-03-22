'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Admin() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: 'Mel Schultz', email: 'mel@empresa.com', role: 'admin', status: 'ativo' },
    { id: 2, nome: 'João Silva', email: 'joao@empresa.com', role: 'atendimento', status: 'ativo' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', role: 'cliente' })

  const handleAddUser = (e) => {
    e.preventDefault()
    setUsuarios([...usuarios, { ...formData, id: Date.now(), status: 'ativo' }])
    setFormData({ nome: '', email: '', role: 'cliente' })
    setShowForm(false)
    alert('✅ Usuário criado!')
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#f5f5f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Administração - Usuários</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            ➕ Novo Usuário
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2>Criar Novo Usuário</h2>
            <form onSubmit={handleAddUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', gridColumn: '1 / -1' }}
                >
                  <option value="cliente">Cliente</option>
                  <option value="atendimento">Atendimento</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">Criar</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table className="table">
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.nome}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{ background: u.role === 'admin' ? '#0066cc' : '#666', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      {u.role === 'admin' ? '👑 Admin' : u.role === 'atendimento' ? '💬 Atendimento' : '👤 Cliente'}
                    </span>
                  </td>
                  <td><span style={{ color: '#28a745', fontWeight: '600' }}>✅ {u.status}</span></td>
                  <td>
                    <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '5px 10px', marginRight: '5px' }}>Editar</button>
                    <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '5px 10px', background: '#dc3545', color: 'white' }}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <div style={{ width: '250px', background: '#1a1a1a', color: 'white', padding: '20px', overflowY: 'auto', height: '100vh' }}>
      <h2 style={{ marginBottom: '30px' }}>🎯 AprovaAí</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link href="/dashboard" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link href="/clientes" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Clientes</Link>
        <Link href="/entregaveis" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Entregáveis</Link>
        <Link href="/calendario" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Calendário</Link>
        <Link href="/aprovacoes" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Aprovações</Link>
        <Link href="/admin" style={{ padding: '10px', color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>Admin</Link>
      </nav>
    </div>
  )
}
