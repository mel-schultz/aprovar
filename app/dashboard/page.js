'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '../ThemeContext'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { theme } = useTheme()

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
        background: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: theme === 'dark' ? '#b0b0b0' : '#626262' }}>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <Sidebar onLogout={handleLogout} theme={theme} />

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div style={{ marginBottom: '40px' }}>
          <h1>Bem-vindo ao AprovaAí</h1>
          <p style={{ color: theme === 'dark' ? '#b0b0b0' : '#626262' }}>
            Olá, {user?.email || 'Usuário'}! 👋
          </p>
        </div>

        {/* STATS GRID - 4 COLUNAS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}>
          <StatCard 
            title="📋 Clientes" 
            count="--" 
            color="#0073ea"
            theme={theme}
          />
          <StatCard 
            title="📦 Entregáveis" 
            count="--" 
            color="#4a9eff"
            theme={theme}
          />
          <StatCard 
            title="✅ Aprovados" 
            count="--" 
            color="#00854d"
            theme={theme}
          />
          <StatCard 
            title="⏳ Pendentes" 
            count="--" 
            color="#ffcb00"
            theme={theme}
          />
        </div>

        {/* QUICK ACTIONS */}
        <div>
          <h2>Atalhos Rápidos</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginTop: '20px',
          }}>
            <QuickAction href="/clientes" title="Novo Cliente" icon="➕" desc="Adicione um novo cliente" theme={theme} />
            <QuickAction href="/entregaveis" title="Novo Entregável" icon="📄" desc="Crie um novo entregável" theme={theme} />
            <QuickAction href="/calendario" title="Ver Calendário" icon="📅" desc="Visualize eventos" theme={theme} />
            <QuickAction href="/aprovacoes" title="Revisar Aprovações" icon="✅" desc="Gerencie aprovações" theme={theme} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ onLogout, theme }) {
  return (
    <div className="sidebar">
      <h2>🎯 AprovaAí</h2>

      <nav style={{ marginBottom: '40px' }}>
        <NavLink href="/dashboard" label="Dashboard" icon="📊" active theme={theme} />
        <NavLink href="/clientes" label="Clientes" icon="🏢" theme={theme} />
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" theme={theme} />
        <NavLink href="/calendario" label="Calendário" icon="📅" theme={theme} />
        <NavLink href="/aprovacoes" label="Aprovações" icon="✅" theme={theme} />
        <NavLink href="/admin" label="Administração" icon="⚙️" theme={theme} />
      </nav>

      <div style={{ 
        marginTop: 'auto', 
        paddingTop: '20px', 
        borderTop: `1px solid ${theme === 'dark' ? '#3a3a3a' : '#e9ecef'}`,
      }}>
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="btn btn-negative"
          style={{
            width: '100%',
            justifyContent: 'center',
            marginTop: '12px',
          }}
        >
          🚪 Sair
        </button>
      </div>
    </div>
  )
}

function NavLink({ href, label, icon, active, theme }) {
  return (
    <Link
      href={href}
      className={`nav-item ${active ? 'active' : ''}`}
      style={{ justifyContent: 'flex-start' }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
    </Link>
  )
}

function StatCard({ title, count, color, theme }) {
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
        opacity: theme === 'dark' ? 0.1 : 0.05,
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
      }} />

      <p style={{ 
        margin: '0 0 12px 0', 
        fontSize: '13px', 
        color: theme === 'dark' ? '#808080' : '#999999',
        fontWeight: '500',
      }}>
        {title}
      </p>
      <p style={{
        margin: '0',
        fontSize: '32px',
        fontWeight: '700',
        color: color,
      }}>
        {count}
      </p>
    </div>
  )
}

function QuickAction({ href, title, icon, desc, theme }) {
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
        background: theme === 'dark'
          ? 'rgba(74, 158, 255, 0.15)'
          : 'rgba(0, 115, 234, 0.1)',
        borderRadius: '8px',
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ 
          margin: '0 0 4px 0', 
          fontSize: '16px',
          fontWeight: '600',
          color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
        }}>
          {title}
        </h3>
        <p style={{ 
          margin: '0', 
          fontSize: '13px', 
          color: theme === 'dark' ? '#808080' : '#999999',
        }}>
          {desc}
        </p>
      </div>
    </Link>
  )
}
