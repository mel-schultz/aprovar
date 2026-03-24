import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard, Calendar, Users, Globe, FileText,
  CheckSquare, Plug, Settings, ArrowRight, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'

interface Stats {
  clients: number
  approvals_pending: number
  approvals_approved: number
  blog_posts: number
}

const shortcuts = [
  { to: '/calendar', label: 'Calendário', icon: Calendar, color: '#ddf4ff', iconColor: '#0969da' },
  { to: '/clients', label: 'Clientes', icon: Users, color: '#dafbe1', iconColor: '#1a7f37' },
  { to: '/social', label: 'Redes Sociais', icon: Globe, color: '#fff8c5', iconColor: '#7d4e00' },
  { to: '/blog', label: 'Blog', icon: FileText, color: '#fce4ec', iconColor: '#880e4f' },
  { to: '/approvals', label: 'Aprovações', icon: CheckSquare, color: '#f3e5f5', iconColor: '#6a1b9a' },
  { to: '/integrations', label: 'Integrações', icon: Plug, color: '#e8f4fd', iconColor: '#0a66c2' },
  { to: '/settings', label: 'Configurações', icon: Settings, color: '#f6f8fa', iconColor: '#57606a' },
]

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats>({ clients: 0, approvals_pending: 0, approvals_approved: 0, blog_posts: 0 })
  const [recentApprovals, setRecentApprovals] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('clients').select('id', { count: 'exact' }),
      supabase.from('approvals').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('approvals').select('id', { count: 'exact' }).eq('status', 'approved'),
      supabase.from('blog_posts').select('id', { count: 'exact' }),
      supabase.from('approvals').select('*, client:clients(name)').order('created_at', { ascending: false }).limit(5),
    ]).then(([c, ap, aa, bp, ra]) => {
      setStats({
        clients: c.count || 0,
        approvals_pending: ap.count || 0,
        approvals_approved: aa.count || 0,
        blog_posts: bp.count || 0,
      })
      setRecentApprovals(ra.data || [])
    })
  }, [user])

  const statusIcon = (s: string) => {
    if (s === 'approved') return <CheckCircle size={14} color="#1a7f37" />
    if (s === 'rejected') return <XCircle size={14} color="#cf222e" />
    if (s === 'pending') return <Clock size={14} color="#7d4e00" />
    return <AlertCircle size={14} color="#57606a" />
  }

  const statusLabel: Record<string, string> = {
    draft: 'Rascunho', pending: 'Aguardando', approved: 'Aprovado',
    rejected: 'Rejeitado', published: 'Publicado',
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>
          Olá, {profile?.full_name?.split(' ')[0] || 'usuário'}!
        </h1>
        <p style={{ color: '#57606a', fontSize: 14, margin: 0 }}>Aqui está um resumo das suas atividades</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dafbe1' }}>
            <Users size={20} color="#1a7f37" />
          </div>
          <div>
            <p className="stat-label">Clientes</p>
            <p className="stat-value">{stats.clients}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff8c5' }}>
            <Clock size={20} color="#7d4e00" />
          </div>
          <div>
            <p className="stat-label">Aprovações Pendentes</p>
            <p className="stat-value">{stats.approvals_pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ddf4ff' }}>
            <CheckSquare size={20} color="#0969da" />
          </div>
          <div>
            <p className="stat-label">Aprovados</p>
            <p className="stat-value">{stats.approvals_approved}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce4ec' }}>
            <FileText size={20} color="#880e4f" />
          </div>
          <div>
            <p className="stat-label">Posts de Blog</p>
            <p className="stat-value">{stats.blog_posts}</p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Atalhos rápidos</h3>
          </div>
          <div className="grid-2" style={{ gap: 10 }}>
            {shortcuts.map(({ to, label, icon: Icon, color, iconColor }) => (
              <button
                key={to}
                className="shortcut-card"
                onClick={() => navigate(to)}
              >
                <div className="shortcut-icon" style={{ background: color }}>
                  <Icon size={18} color={iconColor} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2328' }}>{label}</div>
                </div>
                <ArrowRight size={14} color="#8c959f" style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Aprovações recentes</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/approvals')}>Ver todas</button>
          </div>
          {recentApprovals.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <CheckSquare size={32} />
              <p>Nenhuma aprovação ainda</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentApprovals.map((a: any) => (
                <div
                  key={a.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f6f8fa', cursor: 'pointer' }}
                  onClick={() => navigate('/approvals')}
                >
                  {statusIcon(a.status)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1f2328', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: '#57606a' }}>{a.client?.name || 'Sem cliente'}</div>
                  </div>
                  <span className={`status-badge status-${a.status}`}>{statusLabel[a.status] || a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
