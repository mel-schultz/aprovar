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

  if (loading) return <LoadingScreen />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <div style={{ marginBottom: '40px' }}>
          <h1>Dashboard</h1>
          <p>Bem-vindo, {user?.email}! 👋</p>
        </div>

        <div className="dashboard-grid-4" style={{ marginBottom: '40px' }}>
          <StatCard title="Clientes" count="--" icon="🏢" />
          <StatCard title="Entregáveis" count="--" icon="📦" />
          <StatCard title="Aprovados" count="--" icon="✅" />
          <StatCard title="Pendentes" count="--" icon="⏳" />
        </div>

        <h2>Atalhos Rápidos</h2>
        <div className="dashboard-grid-4">
          <QuickCard href="/clientes" icon="➕" title="Novo Cliente" desc="Adicione cliente" />
          <QuickCard href="/entregaveis" icon="📄" title="Novo Projeto" desc="Crie projeto" />
          <QuickCard href="/calendario" icon="📅" title="Calendário" desc="Ver eventos" />
          <QuickCard href="/aprovacoes" icon="✅" title="Aprovações" desc="Revisar" />
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
      <button onClick={onLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
        🚪 Sair
      </button>
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

function StatCard({ title, count, icon }) {
  return (
    <div className="card">
      <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#cbd5e1' }}>{title}</p>
      <h3 style={{ margin: 0, fontSize: '32px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{count}</h3>
    </div>
  )
}

function QuickCard({ href, icon, title, desc }) {
  return (
    <Link href={href} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px', cursor: 'pointer' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{desc}</p>
    </Link>
  )
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float 2s ease-in-out infinite' }}>⏳</div>
        <p>Carregando...</p>
      </div>
    </div>
  )
}
