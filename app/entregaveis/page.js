'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Entregaveis() {
  const [entregaveis, setEntregaveis] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '' })

  const handleAddEntregavel = (e) => {
    e.preventDefault()
    setEntregaveis([...entregaveis, { ...formData, id: Date.now(), status: 'pendente' }])
    setFormData({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '' })
    setShowForm(false)
    alert('✅ Entregável criado com sucesso!')
  }

  const updateStatus = (id, status) => {
    setEntregaveis(entregaveis.map(e => e.id === id ? { ...e, status } : e))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1>Entregáveis</h1>
            <p>Gerencie todos os seus entregáveis e anexos</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '❌ Cancelar' : '➕ Novo Entregável'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '40px' }}>
            <h2>Criar Novo Entregável</h2>
            <form onSubmit={handleAddEntregavel}>
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  placeholder="Ex: Design da Landing Page"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  placeholder="Descreva o entregável..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label>Cliente</label>
                  <input
                    type="text"
                    placeholder="Nome do cliente"
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Data de Entrega</label>
                  <input
                    type="date"
                    value={formData.dataEntrega}
                    onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Anexo</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, arquivo: e.target.files[0]?.name || '' })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Criar Entregável
                </button>
              </div>
            </form>
          </div>
        )}

        {entregaveis.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
            <h3>Nenhum entregável criado</h3>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '20px' }}>
              Clique em "➕ Novo Entregável" para criar o primeiro
            </p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Criar Primeiro Entregável
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {entregaveis.map(e => (
              <div key={e.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{e.titulo}</h3>
                    <p style={{ margin: '0', fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                      Cliente: <strong>{e.cliente || '—'}</strong> • Entrega: <strong>{e.dataEntrega || '—'}</strong>
                    </p>
                  </div>
                  <span className={`status-badge status-${e.status}`}>
                    {e.status === 'pendente' ? '⏳ Pendente' : e.status === 'aprovado' ? '✅ Aprovado' : '❌ Rejeitado'}
                  </span>
                </div>
                {e.descricao && <p style={{ margin: '12px 0', fontSize: '14px' }}>{e.descricao}</p>}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  {e.status === 'pendente' && (
                    <>
                      <button 
                        onClick={() => updateStatus(e.id, 'aprovado')}
                        className="btn btn-success"
                        style={{ fontSize: '12px', padding: '8px 16px' }}
                      >
                        ✅ Aprovar
                      </button>
                      <button 
                        onClick={() => updateStatus(e.id, 'rejeitado')}
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '8px 16px' }}
                      >
                        ❌ Rejeitar
                      </button>
                    </>
                  )}
                  <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '8px 16px' }}>
                    👁️ Visualizar
                  </button>
                </div>
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
