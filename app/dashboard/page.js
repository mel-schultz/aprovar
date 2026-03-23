'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

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
          <StatCard title="📋 Clientes" count="--" color="linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-secondary) 100%)" />
          <StatCard title="📦 Entregáveis" count="--" color="linear-gradient(135deg, var(--md-sys-color-secondary) 0%, var(--md-sys-color-tertiary) 100%)" />
          <StatCard title="✅ Aprovados" count="--" color="linear-gradient(135deg, var(--md-sys-color-success) 0%, var(--md-sys-color-success-container) 100%)" />
          <StatCard title="⏳ Pendentes" count="--" color="linear-gradient(135deg, var(--md-sys-color-warning) 0%, var(--md-sys-color-warning-container) 100%)" />
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

      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="btn btn-danger"
          style={{
            width: '100%',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--md-sys-color-error) 0%, var(--md-sys-color-error-container) 100%)',
            color: 'var(--md-sys-color-on-error)',
            border: 'none',
          }}
        >
          🚪 Sair
        </button>
      </div>
    </div>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link
      href={href}
      className={`nav-item ${active ? 'active' : ''}`}
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

      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>
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
        background: 'var(--md-sys-color-primary-container)',
        borderRadius: '16px', /* Material Design 3 */
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{title}</h3>
        <p style={{ margin: '0', fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>{desc}</p>
      </div>
    </Link>
  )
}
