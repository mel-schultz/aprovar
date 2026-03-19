'use client'

import { useState } from 'react'
import { Plus, Send, Eye, Link as LinkIcon, CheckSquare } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { Button, Card, Modal, FormField, EmptyState, StatusBadge } from '../../components/ui'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

const STATUSES = ['all', 'pending', 'approved', 'revision', 'rejected']
const STATUS_LABELS = { all: 'Todos', pending: 'Pendentes', approved: 'Aprovados', revision: 'Em revisão', rejected: 'Recusados' }

function DeliverableForm({ clients, onSave, onCancel }) {
  const supabase = createClient()
  const [form, setForm] = useState({ client_id: '', title: '', description: '', network: '', scheduled_at: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    let file_url = null
    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('deliverables').upload(path, file)
      if (upErr) { toast.error('Erro no upload: ' + upErr.message); setLoading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('deliverables').getPublicUrl(path)
      file_url = publicUrl
    }
    await onSave({ ...form, file_url, file_type: file?.type || null, scheduled_at: form.scheduled_at || null })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Cliente *">
        <select value={form.client_id} onChange={e => set('client_id', e.target.value)} required>
          <option value="">Selecione um cliente</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </FormField>
      <FormField label="Título do conteúdo *">
        <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post Instagram — Julho" required />
      </FormField>
      <FormField label="Descrição / orientações">
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Contexto sobre este conteúdo..." />
      </FormField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Rede social">
          <select value={form.network} onChange={e => set('network', e.target.value)}>
            <option value="">— Sem rede —</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
          </select>
        </FormField>
        <FormField label="Agendar para">
          <input type="datetime-local" value={form.scheduled_at} onChange={e => set('scheduled_at', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Arquivo (imagem, vídeo, PDF)">
        <input type="file" accept="image/*,video/*,.pdf" onChange={e => setFile(e.target.files[0])} style={{ padding: '8px 12px' }} />
      </FormField>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}><Send size={15} /> Enviar para aprovação</Button>
      </div>
    </form>
  )
}

function ApprovalLinkCard({ deliverable }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const url = `${baseUrl}/approve/${deliverable.token}`
  function copy() { navigator.clipboard.writeText(url); toast.success('Link copiado!') }
  return (
    <div style={{ background: 'var(--surface-3)', borderRadius: 8, padding: 14, marginTop: 12 }}>
      <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>Link de aprovação</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={url} readOnly style={{ fontSize: 12, color: 'var(--text-2)' }} onClick={e => e.target.select()} />
        <Button size="sm" variant="outline" onClick={copy}><LinkIcon size={13} /> Copiar</Button>
      </div>
    </div>
  )
}

export default function ApprovalsClient({ initialDeliverables, clients, userId }) {
  const supabase = createClient()
  const [deliverables, setDeliverables] = useState(initialDeliverables)
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  async function handleSave(form) {
    const { data, error } = await supabase
      .from('deliverables')
      .insert({ ...form, profile_id: userId, status: 'pending' })
      .select('*, clients(name)')
      .single()
    if (error) { toast.error(error.message); return }
    setDeliverables(d => [data, ...d])
    setModal(false)
    toast.success('Entregável criado! Copie o link para enviar ao cliente.')
    setSelected(data)
  }

  const filtered = filter === 'all' ? deliverables : deliverables.filter(d => d.status === filter)

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Aprovações</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Envie e gerencie conteúdos para aprovação.</p>
        </div>
        <Button onClick={() => setModal(true)}><Plus size={16} /> Novo entregável</Button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: filter === s ? 'var(--brand)' : 'var(--surface)', color: filter === s ? '#fff' : 'var(--text-2)', border: `1px solid ${filter === s ? 'var(--brand)' : 'var(--border)'}`, transition: 'all .15s' }}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={CheckSquare} title="Nenhum entregável" description="Crie um entregável e envie o link para seu cliente aprovar." action={<Button onClick={() => setModal(true)}><Plus size={16} /> Criar entregável</Button>} /></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(d => (
            <Card key={d.id} style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{d.title}</p>
                    <StatusBadge status={d.status} />
                    {d.network && <span style={{ fontSize: 11, background: 'var(--surface-3)', borderRadius: 6, padding: '2px 8px', color: 'var(--text-2)' }}>{d.network}</span>}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {d.clients?.name} · {formatDistanceToNow(new Date(d.created_at), { locale: ptBR, addSuffix: true })}
                    {d.scheduled_at && ` · Agendado: ${new Date(d.scheduled_at).toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="secondary" onClick={() => setSelected(s => s?.id === d.id ? null : d)}>
                    <LinkIcon size={13} /> Link
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => window.open(`/approve/${d.token}`, '_blank')}>
                    <Eye size={13} /> Ver
                  </Button>
                </div>
              </div>
              {selected?.id === d.id && <ApprovalLinkCard deliverable={d} />}
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Novo entregável" width={580}>
        <DeliverableForm clients={clients} onSave={handleSave} onCancel={() => setModal(false)} />
      </Modal>
    </div>
  )
}
