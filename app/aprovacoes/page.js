'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Aprovacoes() {
  const [aprovacoes, setAprovacoes] = useState([
    { id: 1, titulo: 'Logo Design v1', cliente: 'Empresa X', dataEnvio: '2024-03-20', status: 'pendente' },
    { id: 2, titulo: 'Website Homepage', cliente: 'Empresa Y', dataEnvio: '2024-03-19', status: 'pendente' },
  ])

  const handleApprove = (id) => {
    setAprovacoes(aprovacoes.map(a => a.id === id ? { ...a, status: 'aprovado' } : a))
    alert('✅ Entregável aprovado!')
  }

  const handleReject = (id) => {
    setAprovacoes(aprovacoes.map(a => a.id === id ? { ...a, status: 'rejeitado' } : a))
    alert('❌ Entregável rejeitado!')
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'aprovado': return '#d4edda'
      case 'rejeitado': return '#f8d7da'
      default: return '#fff3cd'
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#f5f5f5' }}>
        <h1>Aprovações de Entregáveis</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Revise e aprove os entregáveis enviados</p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <button className="btn btn-secondary">📋 Todos</button>
          <button className="btn btn-secondary">⏳ Pendentes</button>
          <button className="btn btn-secondary">✅ Aprovados</button>
          <button className="btn btn-secondary">❌ Rejeitados</button>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {aprovacoes.map(apr => (
            <div key={apr.id} style={{
              background: getStatusColor(apr.status),
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '5px' }}>{apr.titulo}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    Cliente: <strong>{apr.cliente}</strong> | Enviado em: <strong>{apr.dataEnvio}</strong>
                  </p>
                </div>
                <span className="status-badge" style={{
                  background: apr.status === 'pendente' ? '#fff3cd' : apr.status === 'aprovado' ? '#d4edda' : '#f8d7da',
                  color: apr.status === 'pendente' ? '#856404' : apr.status === 'aprovado' ? '#155724' : '#721c24',
                }}>
                  {apr.status === 'pendente' ? '⏳ Pendente' : apr.status === 'aprovado' ? '✅ Aprovado' : '❌ Rejeitado'}
                </span>
              </div>

              {apr.status === 'pendente' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleApprove(apr.id)} className="btn btn-primary" style={{ background: '#28a745' }}>
                    ✅ Aprovar
                  </button>
                  <button onClick={() => handleReject(apr.id)} className="btn btn-secondary" style={{ background: '#dc3545', color: 'white' }}>
                    ❌ Rejeitar
                  </button>
                  <button className="btn btn-secondary">👁️ Visualizar</button>
                </div>
              )}

              {apr.status !== 'pendente' && (
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  {apr.status === 'aprovado' ? '✅ Aprovado' : '❌ Rejeitado'}
                </p>
              )}
            </div>
          ))}
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
        <Link href="/aprovacoes" style={{ padding: '10px', color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>Aprovações</Link>
      </nav>
    </div>
  )
}
