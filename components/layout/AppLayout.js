'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, CheckSquare, Calendar,
  Settings, Bell, LogOut, ChevronLeft, ChevronRight,
  Puzzle,
} from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/dashboard',    label: 'Início',        icon: LayoutDashboard },
  { href: '/clients',      label: 'Clientes',       icon: Users },
  { href: '/approvals',    label: 'Aprovações',     icon: CheckSquare },
  { href: '/schedule',     label: 'Calendário',     icon: Calendar },
  { href: '/team',         label: 'Equipe',         icon: Users },
  { href: '/integrations', label: 'Integrações',    icon: Puzzle },
  { href: '/settings',     label: 'Configurações',  icon: Settings },
]

export default function AppLayout({ children, profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Até logo!')
    router.push('/login')
    router.refresh()
  }

  const sidebarW = collapsed ? 64 : 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-2)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarW, minHeight: '100vh', background: 'var(--surface)',
        borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, zIndex: 100, transition: 'width .2s ease',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '22px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, background: 'var(--brand)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={16} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--brand)' }}>
                Aprovar
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '10px' : '10px 12px',
                  borderRadius: 10, marginBottom: 2, fontSize: 14, fontWeight: 500,
                  color: active ? 'var(--brand)' : 'var(--text-2)',
                  background: active ? 'var(--brand-light)' : 'transparent',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'all .15s',
                  textDecoration: 'none',
                }}
              >
                <Icon size={18} />
                {!collapsed && label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)' }}>
          {!collapsed && profile && (
            <div style={{ padding: '8px 12px', marginBottom: 4, borderRadius: 10, background: 'var(--surface-3)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{profile.company || profile.full_name || 'Minha conta'}</p>
              <span style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'capitalize' }}>Conta ativa</span>
            </div>
          )}
          <button
            onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px' : '10px 12px', borderRadius: 10, width: '100%', color: 'var(--text-2)', fontSize: 14, fontWeight: 500, justifyContent: collapsed ? 'center' : 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={18} />
            {!collapsed && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: sidebarW, transition: 'margin-left .2s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{ height: 60, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }}>
              <Bell size={18} color="var(--text-2)" />
            </button>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
              {(profile?.company || profile?.full_name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: 28, maxWidth: 1200, width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
