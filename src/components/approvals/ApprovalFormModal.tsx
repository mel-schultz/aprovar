import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Approval, Client } from '../../types'
import toast from 'react-hot-toast'
import { X, Image } from 'lucide-react'

interface Props {
  approval?: Approval | null
  clients: Client[]
  onClose: () => void
  onSaved: () => void
}

const platforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube', 'blog']

export default function ApprovalFormModal({ approval, clients, onClose, onSaved }: Props) {
  const { user } = useAuth()
  const isEdit = !!approval
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    client_id: approval?.client_id || '',
    title: approval?.title || '',
    content: approval?.content || '',
    platform: approval?.platform || 'instagram',
    status: approval?.status || 'draft',
    scheduled_date: approval?.scheduled_date ? approval.scheduled_date.slice(0, 16) : '',
    media_urls: (approval?.media_urls || []).join('\n'),
    notes: approval?.notes || '',
    external_link: approval?.external_link || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      client_id: form.client_id,
      title: form.title,
      content: form.content,
      platform: form.platform,
      status: form.status,
      scheduled_date: form.scheduled_date || null,
      media_urls: form.media_urls.split('\n').map(u => u.trim()).filter(Boolean),
      notes: form.notes,
      external_link: form.external_link,
      created_by: user?.id,
    }
    let error
    if (isEdit) {
      ({ error } = await supabase.from('approvals').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', approval!.id))
    } else {
      ({ error } = await supabase.from('approvals').insert([payload]))
    }
    setLoading(false)
    if (error) toast.error(error.message)
    else { toast.success(isEdit ? 'Aprovação atualizada!' : 'Aprovação criada!'); onSaved() }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{isEdit ? 'Editar Publicação' : 'Nova Publicação para Aprovação'}</h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Cliente *</label>
                <select className="form-select" value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))} required>
                  <option value="">Selecione</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Plataforma *</label>
                <select className="form-select" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                  {platforms.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Conteúdo / Legenda *</label>
              <textarea className="form-textarea" style={{ minHeight: 120 }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Image size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                URLs de mídia (uma por linha)
              </label>
              <textarea className="form-textarea" style={{ minHeight: 70 }} placeholder="https://..." value={form.media_urls} onChange={e => setForm(f => ({ ...f, media_urls: e.target.value }))} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Data programada</label>
                <input className="form-input" type="datetime-local" value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as typeof f.status }))}>
                  <option value="draft">Rascunho</option>
                  <option value="pending">Aguardando aprovação</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Rejeitado</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Observações internas</label>
              <textarea className="form-textarea" style={{ minHeight: 70 }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
