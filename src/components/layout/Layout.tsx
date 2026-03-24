import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard, Calendar, Users, Globe, FileText, CheckSquare,
  Plug, Settings, LogOut, ChevronRight, Bell
} from 'lucide-react'
import { useState } from 'react'
import NotificationsPanel from './NotificationsPanel'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendário', icon: Calendar },
  { to: '/clients', label: 'Clientes', icon: Users },
  { to: '/social', label: 'Redes Sociais', icon: Globe },
  { to: '/blog', label: 'Blog', icon: FileText },
  { to: '/approvals', label: 'Aprovações', icon: CheckSquare },
  { to: '/integrations', label: 'Integrações', icon: Plug },
]

export default function Layout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'atendimento'

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? 'U'

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-dot" />
          <span className="sidebar-logo-text">Approve</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/users"
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <Users size={18} />
              Usuários
            </NavLink>
          )}
        </nav>
        <div className="sidebar-footer">
          <NavLink
            to="/settings"
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          >
            <Settings size={18} />
            Configurações
          </NavLink>
          <button className="sidebar-nav-item" onClick={handleSignOut}>
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ChevronRight size={16} color="#8c959f" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <button className="btn-icon" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={18} />
              </button>
              {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              onClick={() => navigate('/settings')}
            >
              <div className="avatar">{initials}</div>
              <div style={{ fontSize: 13 }}>
                <div style={{ fontWeight: 600, color: '#1f2328' }}>{profile?.full_name || 'Usuário'}</div>
                <div style={{ color: '#57606a', fontSize: 11 }}>
                  {profile?.role === 'super_admin' ? 'Super Admin' : profile?.role === 'atendimento' ? 'Atendimento' : 'Cliente'}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
