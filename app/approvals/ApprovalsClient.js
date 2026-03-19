'use client'

import { getDeliverablesWithClientName } from '../../lib/supabase/queries'

import { useState } from 'react'
import { Plus, Send, Eye, Link as LinkIcon, CheckSquare, RefreshCw, Upload, Edit2, X, ExternalLink } from 'lucide-react'
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

// NEW: Modal com todas as informações do entregável para editar
function DeliverableDetailsModal({ deliverable, clients, onClose, onSaved }) {
  const supabase = createClient()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    title: deliverable.title,
    description: deliverable.description,
    client_id: deliverable.client_id,
    network: deliverable.network || '',
    scheduled_at: deliverable.scheduled_at ? new Date(deliverable.scheduled_at).toISOString().slice(0, 16) : '',
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e) {
    e.preventDefault()
    setLoading(true)

    try {
      let new_file_url = deliverable.file_url
      if (file) {
        const ext = file.name.split('.').pop()
        const path = `${Date.now()}_edit.${ext}`
        const { error: upErr } = await supabase.storage.from('deliverables').upload(path, file)
        if (upErr) {
          toast.error('Erro ao fazer upload: ' + upErr.message)
          setLoading(false)
          return
        }
        const { data: { publicUrl } } = supabase.storage.from('deliverables').getPublicUrl(path)
        new_file_url = publicUrl
      }

      const { error } = await supabase
        .from('deliverables')
        .update({
          title: form.title,
          description: form.description,
          client_id: form.client_id,
          network: form.network || null,
          scheduled_at: form.scheduled_at || null,
          file_url: new_file_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', deliverable.id)

      if (error) {
        toast.error('Erro ao atualizar: ' + error.message)
        setLoading(false)
        return
      }

      toast.success('Entregável atualizado com sucesso!')
      setIsEditing(false)
      onSaved()
    } catch (err) {
      toast.error('Erro: ' + err.message)
    }
    setLoading(false)
  }

  const clientName = clients.find(c => c.id === deliverable.client_id)?.name || 'Cliente desconhecido'
  const NETWORK_COLORS = { instagram: '#e1306c', facebook: '#1877f2', youtube: '#ff0000', tiktok: '#000' }

  return (
    <div style={{ maxHeight: '90vh', overflowY: 'auto' }}>
      {/* Header com título e status */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{deliverable.title}</h2>
          <StatusBadge status={deliverable.status} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>
          {clientName} • {formatDistanceToNow(new Date(deliverable.created_at), { locale: ptBR, addSuffix: true })}
        </p>
      </div>

      {/* Preview do arquivo atual */}
      {deliverable.file_url && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8 }}>Arquivo atual</p>
          <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: 16 }}>
            {deliverable.file_type?.startsWith('image') ? (
              <img src={deliverable.file_url} alt="preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, display: 'block' }} />
            ) : deliverable.file_type?.startsWith('video') ? (
              <video src={deliverable.file_url} controls style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
            ) : (
              <a href={deliverable.file_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand)', fontWeight: 500, fontSize: 14 }}>
                <ExternalLink size={16} /> Abrir arquivo
              </a>
            )}
          </div>
        </div>
      )}

      {/* Modo edição ou visualização */}
      {!isEditing ? (
        <div>
          {/* Informações em modo visualização */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>Descrição</p>
            <p style={{ fontSize: 14, color: 'var(--text)', margin: 0 }}>{deliverable.description || '—'}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>Rede social</p>
            <p style={{ fontSize: 14, color: 'var(--text)', margin: 0 }}>
              {deliverable.network ? (
                <span style={{ fontSize: 11, background: (NETWORK_COLORS[deliverable.network] || 'var(--brand)') + '22', color: NETWORK_COLORS[deliverable.network] || 'var(--brand)', borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>
                  {deliverable.network}
                </span>
              ) : '—'}
            </p>
          </div>

          {deliverable.scheduled_at && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>Agendado para</p>
              <p style={{ fontSize: 14, color: 'var(--text)', margin: 0 }}>{new Date(deliverable.scheduled_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          )}

          {/* Botão editar */}
          <Button onClick={() => setIsEditing(true)} style={{ width: '100%', marginTop: 16 }}>
            <Edit2 size={14} /> Editar entregável
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <FormField label="Cliente *">
            <select value={form.client_id} onChange={e => set('client_id', e.target.value)} required>
              <option value="">Selecione um cliente</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>

          <FormField label="Título *">
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post Instagram — Julho" required />
          </FormField>

          <FormField label="Descrição">
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Contexto..." />
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

          <FormField label="Substituir arquivo (opcional)">
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>Se não fazer upload, manterá o arquivo atual</p>
            <input type="file" accept="image/*,video/*,.pdf" onChange={e => setFile(e.target.files?.[0])} style={{ padding: '8px 12px' }} />
          </FormField>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <Button variant="secondary" type="button" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button type="submit" loading={loading}><Upload size={14} /> Salvar alterações</Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function ApprovalsClient({ initialDeliverables, clients, userId }) {
  const supabase = createClient()
  const [deliverables, setDeliverables] = useState(initialDeliverables)
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [detailsModal, setDetailsModal] = useState(null) // NEW

  async function handleSave(form) {
    const { data: inserted, error } = await supabase
      .from('deliverables')
      .insert({ ...form, profile_id: userId, status: 'pending' })
      .select('*')
      .single()
    const data = inserted ? { ...inserted, clients: null } : null
    if (error) { toast.error(error.message); return }
    setDeliverables(d => [data, ...d])
    setModal(false)
    toast.success('Entregável criado! Copie o link para enviar ao cliente.')
    setSelected(data)
  }

  // NEW: Função para recarregar após editar
  async function handleDetailsSaved() {
    const { data } = await getDeliverablesWithClientName(supabase, {
      profileId: userId,
      orderBy: { column: 'created_at', ascending: false }
    })
    setDeliverables(data || [])
    setDetailsModal(null)
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
            <Card key={d.id} style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => setDetailsModal(d)}>
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
                <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
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

      {/* NEW: Modal com detalhes do entregável */}
      <Modal open={!!detailsModal} onClose={() => setDetailsModal(null)} title="Detalhes do entregável" width={600}>
        {detailsModal && (
          <DeliverableDetailsModal
            deliverable={detailsModal}
            clients={clients}
            onClose={() => setDetailsModal(null)}
            onSaved={handleDetailsSaved}
          />
        )}
      </Modal>
    </div>
  )
}
