'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Aprovacoes() {
  const [aprovacoes] = useState([
    { id: 1, titulo: 'Logo Design v2', cliente: 'Empresa X', dataEnvio: '2024-03-20', status: 'pendente' },
    { id: 2, titulo: 'Website Homepage', cliente: 'Empresa Y', dataEnvio: '2024-03-19', status: 'pendente' },
    { id: 3, titulo: 'Mobile App Design', cliente: 'Empresa Z', dataEnvio: '2024-03-18', status: 'aprovado' },
  ])
  const [filterStatus, setFilterStatus] = useState('todos')

  const filtrados = filterStatus === 'todos' ? aprovacoes : aprovacoes.filter(a => a.status === filterStatus)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <h1>Aprovações</h1>
        <p>Revise e aprove os entregáveis enviados</p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button className={filterStatus === 'todos' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setFilterStatus('todos')}>
            📋 Todos ({aprovacoes.length})
          </button>
          <button className={filterStatus === 'pendente' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setFilterStatus('pendente')}>
            ⏳ Pendentes ({aprovacoes.filter(a => a.status === 'pendente').length})
          </button>
          <button className={filterStatus === 'aprovado' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setFilterStatus('aprovado')}>
            ✅ Aprovados ({aprovacoes.filter(a => a.status === 'aprovado').length})
          </button>
        </div>

        {filtrados.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3>Tudo em dia!</h3>
            <p>Nenhuma aprovação {filterStatus !== 'todos' ? 'nesta categoria' : ''}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {filtrados.map(apr => (
              <div key={apr.id} className="card" style={{
                borderLeft: `4px solid ${apr.status === 'pendente' ? '#f59e0b' : apr.status === 'aprovado' ? '#10b981' : '#ef4444'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{apr.titulo}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>
                      👤 {apr.cliente} • 📅 {apr.dataEnvio}
                    </p>
                  </div>
                  <span className={`status-badge status-${apr.status}`}>
                    {apr.status === 'pendente' ? '⏳ Pendente' : '✅ Aprovado'}
                  </span>
                </div>
                {apr.status === 'pendente' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-success" style={{ fontSize: '13px' }}>✅ Aprovar</button>
                    <button className="btn btn-danger" style={{ fontSize: '13px' }}>❌ Rejeitar</button>
                    <button className="btn btn-secondary" style={{ fontSize: '13px' }}>👁️ Visualizar</button>
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
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" />
        <NavLink href="/calendario" label="Calendário" icon="📅" />
        <NavLink href="/aprovacoes" label="Aprovações" icon="✅" active />
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
