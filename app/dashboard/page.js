'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <Sidebar onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div style={{ marginBottom: '40px' }}>
          <h1>Bem-vindo ao AprovaAí</h1>
          <p>Olá, {user?.email || 'Usuário'}! 👋</p>
        </div>

        {/* STATS GRID - 4 COLUNAS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <StatCard title="📋 Clientes" count="--" color="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" />
          <StatCard title="📦 Entregáveis" count="--" color="linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)" />
          <StatCard title="✅ Aprovados" count="--" color="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
          <StatCard title="⏳ Pendentes" count="--" color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
        </div>

        {/* QUICK ACTIONS */}
        <div>
          <h2>Atalhos Rápidos</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginTop: '20px',
          }}>
            <QuickAction href="/clientes" title="Novo Cliente" icon="➕" desc="Adicione um novo cliente" />
            <QuickAction href="/entregaveis" title="Novo Entregável" icon="📄" desc="Crie um novo entregável" />
            <QuickAction href="/calendario" title="Ver Calendário" icon="📅" desc="Visualize eventos" />
            <QuickAction href="/aprovacoes" title="Revisar Aprovações" icon="✅" desc="Gerencie aprovações" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <h2>🎯 AprovaAí</h2>

      <nav style={{ marginBottom: '40px' }}>
        <NavLink href="/dashboard" label="Dashboard" icon="📊" active />
        <NavLink href="/clientes" label="Clientes" icon="🏢" />
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" />
        <NavLink href="/calendario" label="Calendário" icon="📅" />
        <NavLink href="/aprovacoes" label="Aprovações" icon="✅" />
        <NavLink href="/admin" label="Administração" icon="⚙️" />
      </nav>

      <button
        onClick={onLogout}
        className="btn btn-danger"
        style={{
          width: '100%',
          justifyContent: 'center',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#fca5a5',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}
      >
        🚪 Sair
      </button>
    </div>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link
      href={href}
      className="nav-item"
      style={{ justifyContent: 'flex-start' }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <a style={{ flex: 1, textAlign: 'left' }}>{label}</a>
    </Link>
  )
}

function StatCard({ title, count, color }) {
  return (
    <div className="card" style={{
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: color,
        opacity: 0.05,
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
      }} />

      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#cbd5e1' }}>
        {title}
      </p>
      <p style={{
        margin: '0',
        fontSize: '36px',
        fontWeight: '700',
        background: color,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {count}
      </p>
    </div>
  )
}

function QuickAction({ href, title, icon, desc }) {
  return (
    <Link href={href} className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '24px',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '40px',
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '12px',
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{title}</h3>
        <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>{desc}</p>
      </div>
    </Link>
  )
}
