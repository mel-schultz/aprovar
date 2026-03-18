import { useEffect, useState } from 'react'
import { Plus, Users, Trash2, Shield, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card, Modal, FormField, EmptyState } from '../components/ui'
import toast from 'react-hot-toast'

export default function TeamPage() {
  const { user, profile } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'member' })
  const [saving, setSaving] = useState(false)

  const isIntermediate = ['intermediate', 'complete'].includes(profile?.plan)

  useEffect(() => {
    if (!user) return
    supabase.from('team_members').select('*').eq('profile_id', user.id)
      .then(({ data }) => { setMembers(data || []); setLoading(false) })
  }, [user])

  async function invite(e) {
    e.preventDefault()
    setSaving(true)
    const { data, error } = await supabase.from('team_members').insert({ ...form, profile_id: user.id }).select().single()
    if (error) { toast.error(error.message); setSaving(false); return }
    setMembers(m => [...m, data])
    setModal(false)
    setForm({ name: '', email: '', role: 'member' })
    toast.success('Membro convidado!')
    setSaving(false)
  }

  async function remove(id) {
    if (!window.confirm('Remover este membro?')) return
    await supabase.from('team_members').delete().eq('id', id)
    setMembers(m => m.filter(mb => mb.id !== id))
    toast.success('Membro removido.')
  }

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26 }}>Equipe</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>Adicione membros para colaborar com seus projetos.</p>
        </div>
        {isIntermediate
          ? <Button onClick={() => setModal(true)}><Plus size={16} /> Convidar membro</Button>
          : <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: 'var(--text-2)' }}>
              Disponível nos planos Intermediário e Completo.
            </div>
        }
      </div>

      {!isIntermediate && (
        <Card style={{ padding: 24, marginBottom: 20, borderLeft: '4px solid var(--accent)', borderRadius: '0 12px 12px 0' }}>
          <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
            Gerencie equipes com até 5 membros no plano Intermediário, ou membros ilimitados no plano Completo.{' '}
          </p>
        </Card>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: 40 }}>Carregando...</p>
      ) : members.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="Nenhum membro na equipe" description="Convide colaboradores para gerenciar projetos juntos." action={isIntermediate && <Button onClick={() => setModal(true)}><Plus size={16} /> Convidar</Button>} />
        </Card>
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
                <button onClick={() => remove(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Convidar membro">
        <form onSubmit={invite}>
          <FormField label="Nome">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ana Lima" />
          </FormField>
          <FormField label="E-mail *">
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ana@agencia.com" required />
          </FormField>
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
