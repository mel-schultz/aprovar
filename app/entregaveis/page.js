'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Entregaveis() {
  const [entregaveis, setEntregaveis] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ titulo: '', cliente: '', dataEntrega: '', descricao: '' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!formData.titulo.trim()) {
      alert('Digite um título')
      return
    }
    setEntregaveis([...entregaveis, { id: Date.now(), ...formData, status: 'pendente' }])
    setFormData({ titulo: '', cliente: '', dataEntrega: '', descricao: '' })
    setShowForm(false)
  }

  const updateStatus = (id, status) => {
    setEntregaveis(entregaveis.map(e => e.id === id ? { ...e, status } : e))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1>Entregáveis</h1>
            <p>Gerencie todos os seus projetos e entregas</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '❌ Cancelar' : '➕ Novo Entregável'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '32px' }}>
            <h2>Criar Novo Entregável</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Título *</label>
                <input type="text" placeholder="Nome do projeto" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Cliente</label>
                  <input type="text" placeholder="Nome do cliente" value={formData.cliente} onChange={(e) => setFormData({...formData, cliente: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Data de Entrega</label>
                  <input type="date" value={formData.dataEntrega} onChange={(e) => setFormData({...formData, dataEntrega: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea placeholder="Detalhes do entregável..." value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">💾 Criar</button>
              </div>
            </form>
          </div>
        )}

        {entregaveis.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3>Nenhum entregável criado</h3>
            <p>Clique em "➕ Novo Entregável" para começar</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {entregaveis.map(e => (
              <div key={e.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{e.titulo}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>
                      👤 {e.cliente || '—'} • 📅 {e.dataEntrega || '—'}
                    </p>
                  </div>
                  <span className={`status-badge status-${e.status}`}>
                    {e.status === 'pendente' ? '⏳ Pendente' : e.status === 'aprovado' ? '✅ Aprovado' : '❌ Rejeitado'}
                  </span>
                </div>
                {e.descricao && <p style={{ margin: '12px 0', fontSize: '14px' }}>{e.descricao}</p>}
                {e.status === 'pendente' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => updateStatus(e.id, 'aprovado')} className="btn btn-success" style={{ fontSize: '12px', padding: '8px 16px' }}>✅ Aprovar</button>
                    <button onClick={() => updateStatus(e.id, 'rejeitado')} className="btn btn-danger" style={{ fontSize: '12px', padding: '8px 16px' }}>❌ Rejeitar</button>
                  </div>
                )}
              </div>
            ))}
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
        <NavLink href="/clientes" label="Clientes" icon="🏢" />
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" active />
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
