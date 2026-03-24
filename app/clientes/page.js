'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '', telefone: '' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!formData.nome.trim() || !formData.email.trim()) {
      alert('Preencha Nome e Email')
      return
    }
    setClientes([...clientes, { id: Date.now(), ...formData }])
    setFormData({ nome: '', email: '', cnpj: '', telefone: '' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (confirm('Deletar este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id))
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1>Clientes</h1>
            <p>Gerenciamento completo de clientes</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '❌ Cancelar' : '➕ Novo Cliente'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '32px' }}>
            <h2>Cadastro de Cliente</h2>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label>Nome *</label>
                  <input type="text" placeholder="Empresa XYZ" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="contato@empresa.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>CNPJ</label>
                  <input type="text" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="tel" placeholder="(11) 99999-9999" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">💾 Salvar</button>
              </div>
            </form>
          </div>
        )}

        {clientes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
            <h3>Nenhum cliente cadastrado</h3>
            <p>Clique em "➕ Novo Cliente" para começar</p>
          </div>
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
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
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>✏️ Editar</button>
                      <button onClick={() => handleDelete(c.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>🗑️ Deletar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
