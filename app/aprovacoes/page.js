'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Aprovacoes() {
  const [aprovacoes, setAprovacoes] = useState([
    { id: 1, titulo: 'Logo Design v2', cliente: 'Empresa X', dataEnvio: '2024-03-20', status: 'pendente' },
    { id: 2, titulo: 'Website Homepage', cliente: 'Empresa Y', dataEnvio: '2024-03-19', status: 'pendente' },
    { id: 3, titulo: 'Mobile App Design', cliente: 'Empresa Z', dataEnvio: '2024-03-18', status: 'aprovado' },
  ])
  const [filterStatus, setFilterStatus] = useState('todos')

  const handleApprove = (id) => {
    setAprovacoes(aprovacoes.map(a => a.id === id ? { ...a, status: 'aprovado' } : a))
    alert('✅ Entregável aprovado com sucesso!')
  }

  const handleReject = (id) => {
    setAprovacoes(aprovacoes.map(a => a.id === id ? { ...a, status: 'rejeitado' } : a))
    alert('❌ Entregável rejeitado!')
  }

  const filteredAprovacoes = filterStatus === 'todos' 
    ? aprovacoes 
    : aprovacoes.filter(a => a.status === filterStatus)

  const getStatusColor = (status) => {
    switch(status) {
      case 'aprovado': return 'rgba(16, 185, 129, 0.1)'
      case 'rejeitado': return 'rgba(239, 68, 68, 0.1)'
      default: return 'rgba(245, 158, 11, 0.1)'
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <div className="main-content">
        <div>
          <h1>Aprovações</h1>
          <p>Revise e aprove os entregáveis enviados</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setFilterStatus('todos')}
            className={filterStatus === 'todos' ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            📋 Todos ({aprovacoes.length})
          </button>
          <button 
            onClick={() => setFilterStatus('pendente')}
            className={filterStatus === 'pendente' ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            ⏳ Pendentes ({aprovacoes.filter(a => a.status === 'pendente').length})
          </button>
          <button 
            onClick={() => setFilterStatus('aprovado')}
            className={filterStatus === 'aprovado' ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            ✅ Aprovados ({aprovacoes.filter(a => a.status === 'aprovado').length})
          </button>
          <button 
            onClick={() => setFilterStatus('rejeitado')}
            className={filterStatus === 'rejeitado' ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            ❌ Rejeitados ({aprovacoes.filter(a => a.status === 'rejeitado').length})
          </button>
        </div>

        {filteredAprovacoes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <h3>Nenhuma aprovação {filterStatus !== 'todos' ? `${filterStatus}` : ''}</h3>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Tudo está em dia!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredAprovacoes.map(apr => (
              <div 
                key={apr.id}
                className="card"
                style={{
                  background: getStatusColor(apr.status),
                  borderLeft: `4px solid ${
                    apr.status === 'pendente' ? '#f59e0b' :
                    apr.status === 'aprovado' ? '#10b981' :
                    '#ef4444'
                  }`,
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{apr.titulo}</h3>
                    <p style={{ margin: '0', fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                      👤 <strong>{apr.cliente}</strong> • 📅 {apr.dataEnvio}
                    </p>
                  </div>
                  <span className={`status-badge status-${apr.status}`}>
                    {apr.status === 'pendente' ? '⏳ Pendente' : apr.status === 'aprovado' ? '✅ Aprovado' : '❌ Rejeitado'}
                  </span>
                </div>

                {apr.status === 'pendente' && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button 
                      onClick={() => handleApprove(apr.id)}
                      className="btn btn-success"
                      style={{ fontSize: '13px' }}
                    >
                      ✅ Aprovar
                    </button>
                    <button 
                      onClick={() => handleReject(apr.id)}
                      className="btn btn-danger"
                      style={{ fontSize: '13px' }}
                    >
                      ❌ Rejeitar
                    </button>
                    <button className="btn btn-secondary" style={{ fontSize: '13px' }}>
                      👁️ Visualizar
                    </button>
                  </div>
                )}

                {apr.status !== 'pendente' && (
                  <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {apr.status === 'aprovado' ? '✅ Aprovado com sucesso' : '❌ Rejeitado pelo revisor'}
                  </p>
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
