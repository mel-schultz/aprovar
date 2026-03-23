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
      if (!session) router.push('/login')
      else setUser(session.user)
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user?.email}! 👋</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <StatCard title="Clientes" count="0" icon="🏢" />
          <StatCard title="Entregáveis" count="0" icon="📦" />
          <StatCard title="Pendentes" count="0" icon="⏳" />
          <StatCard title="Aprovados" count="0" icon="✅" />
        </div>

        <h2>Atalhos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <NavCard href="/clientes" icon="🏢" title="Clientes" />
          <NavCard href="/entregaveis" icon="📦" title="Entregáveis" />
          <NavCard href="/aprovacoes" icon="✅" title="Aprovações" />
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

function StatCard({ title, count, icon }) {
  return (
    <div className="card">
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <p style={{ margin: '0 0 8px 0', color: '#cbd5e1', fontSize: '12px' }}>{title}</p>
      <h3 style={{ margin: 0, fontSize: '28px' }}>{count}</h3>
    </div>
  )
}

function NavCard({ href, icon, title }) {
  return (
    <Link href={href} className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <h3 style={{ margin: 0, fontSize: '14px' }}>{title}</h3>
    </Link>
  )
}
