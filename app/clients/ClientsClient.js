'use client'

import { useState } from 'react'
import { Plus, Users, Trash2, Edit2, ChevronRight } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { Button, Card, Modal, FormField, EmptyState } from '../../components/ui'
import toast from 'react-hot-toast'

function ClientForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', notes: '', ...initial })
  const [loading, setLoading] = useState(false)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    await onSave(form); setLoading(false)
  }
  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Nome do cliente *"><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Empresa XYZ" required /></FormField>
      <FormField label="E-mail"><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contato@empresa.com" /></FormField>
      <FormField label="WhatsApp"><input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+55 11 9..." /></FormField>
      <FormField label="Observações"><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Contexto sobre o cliente..." /></FormField>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>Salvar</Button>
      </div>
    </form>
  )
}

function ApproverForm({ clientId, onClose }) {
  const supabase = createClient()
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' })
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  useState(() => {
    supabase.from('approvers').select('*').eq('client_id', clientId).then(({ data }) => setList(data || []))
  })

  async function add(e) {
    e.preventDefault(); if (!form.name) return; setLoading(true)
    const { data, error } = await supabase.from('approvers').insert({ ...form, client_id: clientId }).select().single()
    if (error) { toast.error(error.message); setLoading(false); return }
    setList(l => [...l, data]); setForm({ name: '', email: '', whatsapp: '' })
    toast.success('Aprovador adicionado!'); setLoading(false)
  }

  async function remove(id) {
    await supabase.from('approvers').delete().eq('id', id)
    setList(l => l.filter(a => a.id !== id)); toast.success('Removido.')
  }

  return (
    <div>
      <form onSubmit={add} style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Nome *"><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="João" required /></FormField>
          <FormField label="E-mail"><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="joao@..." /></FormField>
        </div>
        <FormField label="WhatsApp"><input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+55 11 9..." /></FormField>
        <Button type="submit" loading={loading} size="sm">+ Adicionar aprovador</Button>
      </form>
      {list.map(a => (
        <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-3)', borderRadius: 8, marginBottom: 6 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.email}{a.whatsapp && ` · ${a.whatsapp}`}</p>
          </div>
          <button onClick={() => remove(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><Trash2 size={15} /></button>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Button variant="secondary" onClick={onClose}>Fechar</Button>
      </div>
    </div>
  )
}

export default function ClientsClient({ initialClients, userId }) {
  const supabase = createClient()
  const [clients, setClients] = useState(initialClients)
  const [modal, setModal] = useState(null)

  async function handleSave(form) {
    if (modal === 'create') {
      const { data, error } = await supabase.from('clients').insert({ ...form, profile_id: userId }).select('*, approvers(count)').single()
      if (error) { toast.error(error.message); return }
      setClients(c => [data, ...c]); toast.success('Cliente criado!')
    } else if (modal?.edit) {
      const { data, error } = await supabase.from('clients').update(form).eq('id', modal.edit.id).select('*, approvers(count)').single()
      if (error) { toast.error(error.message); return }
      setClients(c => c.map(cl => cl.id === data.id ? data : cl)); toast.success('Atualizado!')
    }
    setModal(null)
  }

  async function handleDelete(id) {
    if (!window.confirm('Remover este cliente e todos os seus dados?')) return
    await supabase.from('clients').delete().eq('id', id)
    setClients(c => c.filter(cl => cl.id !== id)); toast.success('Cliente removido.')
  }

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Clientes</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Gerencie seus clientes e aprovadores.</p>
        </div>
        <Button onClick={() => setModal('create')}><Plus size={16} /> Novo cliente</Button>
      </div>

      {clients.length === 0 ? (
        <Card><EmptyState icon={Users} title="Nenhum cliente ainda" description="Adicione seu primeiro cliente para começar." action={<Button onClick={() => setModal('create')}><Plus size={16} /> Criar cliente</Button>} /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {clients.map(client => (
            <Card key={client.id} style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--brand)' }}>
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{client.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{client.email || 'Sem e-mail'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setModal({ edit: client })} style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', display: 'flex' }}><Edit2 size={14} color="var(--text-2)" /></button>
                  <button onClick={() => handleDelete(client.id)} style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', display: 'flex' }}><Trash2 size={14} color="var(--danger)" /></button>
                </div>
              </div>
              {client.whatsapp && <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 14 }}>WhatsApp: {client.whatsapp}</p>}
              <button onClick={() => setModal({ approvers: client })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'var(--surface-3)', border: 'none', borderRadius: 8, padding: '10px 14px', cursor: 'pointer' }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>Aprovadores: {client.approvers?.[0]?.count || 0}</span>
                <ChevronRight size={14} color="var(--text-3)" />
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Novo cliente">
        <ClientForm onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={!!modal?.edit} onClose={() => setModal(null)} title="Editar cliente">
        <ClientForm initial={modal?.edit} onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={!!modal?.approvers} onClose={() => setModal(null)} title={`Aprovadores — ${modal?.approvers?.name}`} width={560}>
        {modal?.approvers && <ApproverForm clientId={modal.approvers.id} onClose={() => setModal(null)} />}
      </Modal>
    </div>
  )
}
