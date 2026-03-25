import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Approval, Client } from '../types'
import { Plus, CheckSquare, Edit2, Trash2, Send, Image, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import ApprovalFormModal from '../components/approvals/ApprovalFormModal'

const statusLabel: Record<string, string> = {
  draft: 'Rascunho', pending: 'Aguardando', approved: 'Aprovado',
  rejected: 'Rejeitado', published: 'Publicado',
}

export default function ApprovalsPage() {
  const { user } = useAuth()
  const [approvals, setApprovals] = useState<(Approval & { client?: Client })[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Approval | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterClient, setFilterClient] = useState('')

  const fetch = useCallback(async () => {
    setLoading(true)
    const [{ data: a }, { data: c }] = await Promise.all([
      supabase.from('approvals').select('*, client:clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('*').order('name'),
    ])
    setApprovals((a as any) || [])
    setClients((c as Client[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta aprovação?')) return
    await supabase.from('approvals').delete().eq('id', id)
    toast.success('Aprovação excluída!')
    fetch()
  }

  const handlePublish = async (a: Approval) => {
    if (a.status !== 'approved') {
      toast.error('Somente aprovações com status "Aprovado" podem ser publicadas.')
      return
    }
    await supabase.from('approvals').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', a.id)
    toast.success('Publicado com sucesso!')
    fetch()
  }

  const handleStatusChange = async (a: Approval, status: string) => {
    await supabase.from('approvals').update({ status, updated_at: new Date().toISOString() }).eq('id', a.id)
    toast.success('Status atualizado!')
    fetch()
  }

  const handleResend = async (a: Approval) => {
    await supabase.from('approvals').update({ status: 'pending', updated_at: new Date().toISOString() }).eq('id', a.id)
    toast.success('Reenviado para o cliente!')
    fetch()
  }

  let filtered = approvals
  if (filterStatus) filtered = filtered.filter(a => a.status === filterStatus)
  if (filterClient) filtered = filtered.filter(a => a.client_id === filterClient)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Aprovações</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={16} /> Nova publicação
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <select className="form-select" style={{ maxWidth: 180 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {Object.entries(statusLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: 220 }} value={filterClient} onChange={e => setFilterClient(e.target.value)}>
          <option value="">Todos os clientes</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span style={{ fontSize: 13, color: '#57606a', alignSelf: 'center' }}>{filtered.length} publicação(ões)</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#57606a' }}>Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={40} />
          <h3>Nenhuma publicação encontrada</h3>
          <p>Crie a primeira publicação para aprovação.</p>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}>
            <Plus size={16} /> Nova publicação
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map(a => (
            <div key={a.id} className="approval-card">
              {a.media_urls?.length > 0 ? (
                <img
                  src={a.media_urls[0]}
                  alt=""
                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                  onError={e => {
                    const el = e.target as HTMLImageElement
                    el.style.display = 'none'
                  }}
                />
              ) : (
                <div className="approval-card-image">
                  <Image size={32} />
                </div>
              )}
              <div className="approval-card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className={`status-badge status-${a.status}`}>{statusLabel[a.status]}</span>
                  <span className={`platform-badge platform-${a.platform}`}>{a.platform}</span>
                </div>
                <h4 className="approval-card-title">{a.title}</h4>
                <p className="approval-card-meta">
                  {(a as any).client?.name || 'Sem cliente'}
                  {a.scheduled_date && ` · ${new Date(a.scheduled_date).toLocaleDateString('pt-BR')}`}
                </p>
                <p style={{ fontSize: 13, color: '#57606a', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {a.content}
                </p>
                <div style={{ marginTop: 8 }}>
                  <a 
                    href={`${window.location.origin}/approve/${a.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ fontSize: 12, color: '#0969da', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(`${window.location.origin}/approve/${a.id}`);
                      toast.success('Link copiado para a área de transferência!');
                    }}
                  >
                    <ExternalLink size={12} /> Link para o Cliente
                  </a>
                </div>
                {a.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button className="btn btn-sm" style={{ background: '#dafbe1', border: '1px solid #82e29b', color: '#1a7f37', flex: 1 }} onClick={() => handleStatusChange(a, 'approved')}>
                      Aprovar
                    </button>
                    <button className="btn btn-sm" style={{ background: '#ffebe9', border: '1px solid #ff818266', color: '#cf222e', flex: 1 }} onClick={() => handleStatusChange(a, 'rejected')}>
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
              <div className="approval-card-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(a); setModalOpen(true) }}>
                  <Edit2 size={13} /> Editar
                </button>
                {a.status === 'approved' && (
                  <button className="btn btn-primary btn-sm" onClick={() => handlePublish(a)}>
                    <Send size={13} /> Publicar
                  </button>
                )}
                {(a.status === 'rejected' || a.status === 'approved' || a.status === 'published') && (
                  <button className="btn btn-sm" style={{ background: '#ddf4ff', border: '1px solid #79c0ff', color: '#0969da' }} onClick={() => handleResend(a)}>
                    <Send size={13} /> Reenviar
                  </button>
                )}
                <button className="btn btn-sm" style={{ background: 'none', border: '1px solid transparent', color: '#cf222e', marginLeft: 'auto' }} onClick={() => handleDelete(a.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <ApprovalFormModal
          approval={editing}
          clients={clients}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetch() }}
        />
      )}
    </div>
  )
}
