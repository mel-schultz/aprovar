import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, CheckSquare, Calendar,
  Settings, Bell, LogOut, ChevronLeft, ChevronRight,
  Puzzle, CreditCard, Menu
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard',     label: 'Início',         icon: LayoutDashboard },
  { to: '/clients',       label: 'Clientes',        icon: Users },
  { to: '/approvals',     label: 'Aprovações',      icon: CheckSquare },
  { to: '/schedule',      label: 'Calendário',      icon: Calendar },
  { to: '/team',          label: 'Equipe',          icon: Users },
  { to: '/integrations',  label: 'Integrações',     icon: Puzzle },
  { to: '/billing',       label: 'Planos',          icon: CreditCard },
  { to: '/settings',      label: 'Configurações',   icon: Settings },
]

export default function AppLayout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    toast.success('Até logo!')
    navigate('/login')
  }

  const sidebarW = collapsed ? 64 : 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-2)' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 99 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: sidebarW, minHeight: '100vh', background: 'var(--surface)',
        borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, zIndex: 100,
        transition: 'width .2s ease',
        transform: mobileOpen ? 'translateX(0)' : undefined,
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '24px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, background: 'var(--brand)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={16} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--brand)' }}>
                Aprova<span style={{ color: 'var(--text)' }}>Aí</span>
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px' : '10px 12px',
                borderRadius: 10, marginBottom: 2, fontSize: 14, fontWeight: 500,
                color: isActive ? 'var(--brand)' : 'var(--text-2)',
                background: isActive ? 'var(--brand-light)' : 'transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'all .15s',
              })}
            >
              <Icon size={18} />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          {!collapsed && (
            <div style={{ padding: '8px 12px', marginBottom: 4, borderRadius: 10, background: 'var(--surface-3)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                {profile?.company || profile?.full_name || 'Minha conta'}
              </p>
              <span style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'capitalize' }}>
                Plano {profile?.plan || 'trial'}
              </span>
            </div>
          )}
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px' : '10px 12px', borderRadius: 10,
              width: '100%', color: 'var(--text-2)', fontSize: 14, fontWeight: 500,
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: 'transparent', border: 'none', cursor: 'pointer',
            }}
          >
            <LogOut size={18} />
            {!collapsed && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: sidebarW, transition: 'margin-left .2s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{
          height: 60, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            className="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>
          <div />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', position: 'relative' }}>
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
