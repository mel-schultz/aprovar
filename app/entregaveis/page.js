'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

export default function Entregaveis() {
  const [entregaveis, setEntregaveis] = useState([])
  const [titulo, setTitulo] = useState('')
  const [cliente, setCliente] = useState('')
  const router = useRouter()

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!titulo.trim()) {
      alert('Digite um título')
      return
    }
    setEntregaveis([...entregaveis, { id: Date.now(), titulo, cliente, status: 'pendente' }])
    setTitulo('')
    setCliente('')
  }

  const updateStatus = (id, status) => {
    setEntregaveis(entregaveis.map(e => e.id === id ? { ...e, status } : e))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <h1>Entregáveis</h1>

        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>Novo Entregável</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Título</label>
                <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Nome do entregável" />
              </div>
              <div className="form-group">
                <label>Cliente</label>
                <input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do cliente" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Criar</button>
          </form>
        </div>

        {entregaveis.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p>Nenhum entregável criado</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {entregaveis.map(e => (
              <div key={e.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{e.titulo}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>Cliente: {e.cliente || '-'}</p>
                  </div>
                  <span className={`status-badge status-${e.status}`}>
                    {e.status === 'pendente' ? 'Pendente' : e.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                  </span>
                </div>
                {e.status === 'pendente' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button onClick={() => updateStatus(e.id, 'aprovado')} className="btn btn-success" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      Aprovar
                    </button>
                    <button onClick={() => updateStatus(e.id, 'rejeitado')} className="btn btn-danger" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      Rejeitar
                    </button>
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

function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <h2>🎯 AprovaAí</h2>
      <nav style={{ marginBottom: '40px' }}>
        <NavLink href="/dashboard" label="Dashboard" icon="📊" />
        <NavLink href="/clientes" label="Clientes" icon="🏢" />
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" active />
        <NavLink href="/aprovacoes" label="Aprovações" icon="✅" />
      </nav>
      <button onClick={onLogout} className="btn btn-secondary" style={{ width: '100%' }}>
        🚪 Sair
      </button>
    </div>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link href={href} className={`nav-item ${active ? 'active' : ''}`} style={{ justifyContent: 'flex-start' }}>
      <span>{icon}</span>
      <a>{label}</a>
    </Link>
  )
}
