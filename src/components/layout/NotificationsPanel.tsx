import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Notification } from '../../types'
import { Bell, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const typeColors: Record<string, string> = {
  approval: '#ddf4ff',
  rejection: '#ffebe9',
  comment: '#fff8c5',
  publish: '#dafbe1',
  system: '#f6f8fa',
}

export default function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const [notifs, setNotifs] = useState<Notification[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setNotifs((data as Notification[]) || []))
  }, [user])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const markAllRead = async () => {
    if (!user) return
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
    setNotifs(n => n.map(x => ({ ...x, is_read: true })))
  }

  const unread = notifs.filter(n => !n.is_read).length

  return (
    <div ref={ref} style={{
      position: 'absolute', right: 0, top: '100%', marginTop: 8,
      background: '#fff', border: '1px solid #d0d7de', borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)', width: 340, zIndex: 200
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #d0d7de', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}>
          <Bell size={16} />
          Notificações
          {unread > 0 && <span style={{ background: '#cf222e', color: '#fff', borderRadius: 20, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>{unread}</span>}
        </div>
        {unread > 0 && (
          <button className="btn btn-sm btn-secondary" onClick={markAllRead} style={{ gap: 4, fontSize: 12 }}>
            <CheckCheck size={12} /> Marcar todas como lidas
          </button>
        )}
      </div>
      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        {notifs.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#57606a', fontSize: 13 }}>
            Nenhuma notificação
          </div>
        ) : notifs.map(n => (
          <div key={n.id} style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f6f8fa',
            background: n.is_read ? '#fff' : typeColors[n.type] || '#fff',
            display: 'flex',
            gap: 10,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.is_read ? '#d0d7de' : '#0969da', marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: n.is_read ? 400 : 600, color: '#1f2328' }}>{n.title}</div>
              <div style={{ fontSize: 12, color: '#57606a', marginTop: 2 }}>{n.body}</div>
              <div style={{ fontSize: 11, color: '#8c959f', marginTop: 4 }}>
                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
