'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import Link from 'next/link'

export default function Debug() {
  const [status, setStatus] = useState([])

  useEffect(() => {
    const runChecks = async () => {
      const checks = []

      checks.push({
        name: 'Variáveis de Ambiente',
        status: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
        message: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'URL configurada' : 'URL FALTANDO',
        value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Não encontrada'
      })

      checks.push({
        name: 'Chave Anon',
        status: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌',
        message: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Chave configurada' : 'Chave FALTANDO',
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'Não encontrada'
      })

      try {
        const { data, error } = await supabase.auth.getSession()
        checks.push({
          name: 'Conexão Supabase',
          status: '✅',
          message: 'Supabase respondendo',
          value: 'OK'
        })
      } catch (err) {
        checks.push({
          name: 'Conexão Supabase',
          status: '❌',
          message: 'Erro ao conectar',
          value: err.message
        })
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()
        checks.push({
          name: 'Session',
          status: session ? '✅' : '⚠️',
          message: session ? 'Usuário logado' : 'Nenhum usuário logado',
          value: session?.user?.email || 'Não logado'
        })
      } catch (err) {
        checks.push({
          name: 'Session',
          status: '❌',
          message: 'Erro ao verificar',
          value: err.message
        })
      }

      setStatus(checks)
    }

    runChecks()
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <h1>🔧 Debug</h1>
        <p>Verifique o status de todas as configurações</p>

        <div className="card" style={{ marginBottom: '32px' }}>
          <h2>Status do Sistema</h2>
          {status.length === 0 ? (
            <p>Verificando...</p>
          ) : (
            status.map((check, idx) => (
              <div key={idx} className="card" style={{
                marginBottom: idx < status.length - 1 ? '16px' : '0',
                borderLeft: `4px solid ${check.status === '✅' ? '#10b981' : check.status === '⚠️' ? '#f59e0b' : '#ef4444'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <strong>{check.status} {check.name}</strong>
                  <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{check.message}</span>
                </div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  wordBreak: 'break-all',
                  color: '#a5b4fc',
                  fontFamily: 'monospace'
                }}>
                  {check.value}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card" style={{ background: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid #f59e0b', marginBottom: '24px' }}>
          <h3>⚠️ Se alguma verificação falhou:</h3>
          <ol style={{ fontSize: '14px', color: '#cbd5e1' }}>
            <li style={{ marginBottom: '12px' }}>Crie/verifique arquivo .env.local na raiz do projeto</li>
            <li style={{ marginBottom: '12px' }}>Verifique credenciais no Supabase Settings API</li>
            <li style={{ marginBottom: '12px' }}>Execute migrations.sql no Supabase SQL Editor</li>
            <li>Reinicie: Ctrl+C e npm run dev novamente</li>
          </ol>
        </div>

        <div className="card" style={{ background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid #10b981' }}>
          <h3>✅ Se tudo passou:</h3>
          <p>Vá para <Link href="/login" style={{ color: '#6366f1' }}>Login</Link> e crie uma conta!</p>
        </div>
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
