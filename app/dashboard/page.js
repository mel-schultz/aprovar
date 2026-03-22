'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* SIDEBAR */}
      <div style={{
        width: '250px',
        background: '#1a1a1a',
        color: 'white',
        padding: '20px',
        overflowY: 'auto',
      }}>
        <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>🎯 AprovaAí</h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/clientes" label="Clientes" />
          <NavLink href="/entregaveis" label="Entregáveis" />
          <NavLink href="/calendario" label="Calendário" />
          <NavLink href="/aprovacoes" label="Aprovações" />
          <NavLink href="/admin" label="Administração" />
          <NavLink href="/perfil" label="Meu Perfil" />
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '30px',
            width: '100%',
            padding: '10px',
            background: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Sair
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#f5f5f5' }}>
        <h1>Dashboard</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Bem-vindo, {user?.email}!</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <Card title="📋 Clientes" count="--" />
          <Card title="📦 Entregáveis" count="--" />
          <Card title="✅ Aprovados" count="--" />
          <Card title="⏳ Pendentes" count="--" />
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2>Atalhos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '20px' }}>
            <QuickLink href="/clientes" title="Novo Cliente" icon="➕" />
            <QuickLink href="/entregaveis" title="Novo Entregável" icon="📄" />
            <QuickLink href="/calendario" title="Ver Calendário" icon="📅" />
            <QuickLink href="/aprovacoes" title="Revisar Aprovações" icon="👁️" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NavLink({ href, label }) {
  return (
    <Link href={href} style={{
      padding: '10px',
      borderRadius: '5px',
      color: 'white',
      textDecoration: 'none',
      transition: 'background 0.2s',
    }} onMouseEnter={(e) => e.target.style.background = '#333'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
      {label}
    </Link>
  )
}

function Card({ title, count }) {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <p style={{ fontSize: '14px', color: '#666' }}>{title}</p>
      <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{count}</p>
    </div>
  )
}

function QuickLink({ href, title, icon }) {
  return (
    <Link href={href} style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      textDecoration: 'none',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
    }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'none'}>
      <span style={{ fontSize: '24px' }}>{icon}</span>
      <span style={{ fontWeight: '600' }}>{title}</span>
    </Link>
  )
}
