'use client'

import { useState } from 'react'
import { Plus, Users, Trash2, Shield, User } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { Button, Card, Modal, FormField, EmptyState } from '../../components/ui'
import toast from 'react-hot-toast'

export default function TeamClient({ initialMembers, userId, plan }) {
  const supabase = createClient()
  const [members, setMembers] = useState(initialMembers)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'member' })
  const [saving, setSaving] = useState(false)
  const canInvite = ['intermediate', 'complete'].includes(plan)

  async function invite(e) {
    e.preventDefault(); setSaving(true)
    const { data, error } = await supabase.from('team_members').insert({ ...form, profile_id: userId }).select().single()
    if (error) { toast.error(error.message); setSaving(false); return }
    setMembers(m => [...m, data]); setModal(false); setForm({ name: '', email: '', role: 'member' })
    toast.success('Membro convidado!'); setSaving(false)
  }

  async function remove(id) {
    if (!window.confirm('Remover este membro?')) return
    await supabase.from('team_members').delete().eq('id', id)
    setMembers(m => m.filter(mb => mb.id !== id)); toast.success('Membro removido.')
  }

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Equipe</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Adicione membros para colaborar nos projetos.</p>
        </div>
        {canInvite
          ? <Button onClick={() => setModal(true)}><Plus size={16} /> Convidar membro</Button>
          : <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: 'var(--text-2)' }}>Disponível nos planos Intermediário e Completo.</div>
        }
      </div>

      {!canInvite && (
        <Card style={{ padding: 20, marginBottom: 20, borderLeft: '4px solid var(--accent)', borderRadius: '0 12px 12px 0' }}>
          <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
            Gerencie equipes com até 5 membros no plano Intermediário, ou membros ilimitados no plano Completo.{' '}
            <a href="/billing" style={{ color: 'var(--brand)', fontWeight: 600 }}>Ver planos →</a>
          </p>
        </Card>
      )}

      {members.length === 0 ? (
        <Card><EmptyState icon={Users} title="Nenhum membro na equipe" description="Convide colaboradores para gerenciar projetos juntos." action={canInvite && <Button onClick={() => setModal(true)}><Plus size={16} /> Convidar</Button>} /></Card>
      ) : (
        <Card>
          {members.map((m, i) => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < members.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.role === 'admin' ? <Shield size={18} color="var(--brand)" /> : <User size={18} color="var(--brand)" />}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{m.name || m.email}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{m.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 500, background: m.role === 'admin' ? 'var(--brand-light)' : 'var(--surface-3)', color: m.role === 'admin' ? 'var(--brand)' : 'var(--text-2)', borderRadius: 6, padding: '3px 10px' }}>
                  {m.role === 'admin' ? 'Admin' : 'Membro'}
                </span>
                <button onClick={() => remove(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Convidar membro">
        <form onSubmit={invite}>
          <FormField label="Nome"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ana Lima" /></FormField>
          <FormField label="E-mail *"><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ana@agencia.com" required /></FormField>
          <FormField label="Função">
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="member">Membro</option>
              <option value="admin">Admin</option>
            </select>
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" type="button" onClick={() => setModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Convidar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
