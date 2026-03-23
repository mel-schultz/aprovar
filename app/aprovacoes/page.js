'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

export default function Aprovacoes() {
  const [aprovacoes] = useState([
    { id: 1, titulo: 'Logo Design', cliente: 'Empresa X', status: 'pendente' },
    { id: 2, titulo: 'Website', cliente: 'Empresa Y', status: 'aprovado' },
  ])
  const [filterStatus, setFilterStatus] = useState('todos')
  const router = useRouter()

  const filtrados = filterStatus === 'todos' ? aprovacoes : aprovacoes.filter(a => a.status === filterStatus)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <h1>Aprovações</h1>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <button className={filterStatus === 'todos' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setFilterStatus('todos')}>
            Todos
          </button>
          <button className={filterStatus === 'pendente' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setFilterStatus('pendente')}>
            Pendentes
          </button>
          <button className={filterStatus === 'aprovado' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setFilterStatus('aprovado')}>
            Aprovados
          </button>
        </div>

        {filtrados.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p>Nenhuma aprovação encontrada</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {filtrados.map(a => (
              <div key={a.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{a.titulo}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>Cliente: {a.cliente}</p>
                  </div>
                  <span className={`status-badge status-${a.status}`}>
                    {a.status === 'pendente' ? 'Pendente' : 'Aprovado'}
                  </span>
                </div>
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
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" />
        <NavLink href="/aprovacoes" label="Aprovações" icon="✅" active />
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
