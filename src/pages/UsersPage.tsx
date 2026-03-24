import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Profile, UserRole } from '../types'
import { Plus, Edit2, Trash2, Users, X } from 'lucide-react'
import toast from 'react-hot-toast'

const roleLabel: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  atendimento: 'Atendimento',
  cliente: 'Cliente',
}

const roleColors: Record<UserRole, string> = {
  super_admin: 'status-published',
  atendimento: 'status-approved',
  cliente: 'status-draft',
}

function UserModal({ user: editUser, onClose, onSaved }: { user?: Profile | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!editUser
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: editUser?.full_name || '',
    email: editUser?.email || '',
    role: editUser?.role || 'atendimento' as UserRole,
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (isEdit) {
      const { error } = await supabase.from('profiles').update({
        full_name: form.full_name,
        role: form.role,
        updated_at: new Date().toISOString(),
      }).eq('id', editUser!.id)
      setLoading(false)
      if (error) toast.error(error.message)
      else { toast.success('Usuário atualizado!'); onSaved() }
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: form.email,
        password: form.password || 'TempPass123!',
        email_confirm: true,
        user_metadata: { full_name: form.full_name },
      })
      if (error) { toast.error(error.message); setLoading(false); return }
      await supabase.from('profiles').update({ full_name: form.full_name, role: form.role }).eq('id', data.user.id)
      setLoading(false)
      toast.success('Usuário criado!')
      onSaved()
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nome completo *</label>
              <input className="form-input" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
            </div>
            {!isEdit && (
              <>
                <div className="form-group">
                  <label className="form-label">E-mail *</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Senha temporária</label>
                  <input className="form-input" type="password" placeholder="Min. 6 caracteres" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  <div style={{ fontSize: 12, color: '#57606a', marginTop: 4 }}>Deixe em branco para gerar uma senha padrão.</div>
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label">Nível de acesso *</label>
              <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                <option value="super_admin">Super Admin</option>
                <option value="atendimento">Atendimento</option>
                <option value="cliente">Cliente</option>
              </select>
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

export default function UsersPage() {
  const { profile: myProfile } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Profile | null>(null)
  const [filterRole, setFilterRole] = useState('')

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('full_name')
    setUsers((data as Profile[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleDelete = async (id: string) => {
    if (id === myProfile?.id) { toast.error('Não é possível excluir sua própria conta aqui.'); return }
    if (!confirm('Excluir este usuário?')) return
    await supabase.from('profiles').delete().eq('id', id)
    toast.success('Usuário excluído!')
    fetch()
  }

  const filtered = filterRole ? users.filter(u => u.role === filterRole) : users

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Usuários</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={16} /> Novo usuário
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <select className="form-select" style={{ maxWidth: 200 }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">Todos os níveis</option>
          <option value="super_admin">Super Admin</option>
          <option value="atendimento">Atendimento</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#57606a' }}>Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={40} />
            <h3>Nenhum usuário encontrado</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>E-mail</th>
                <th>Nível</th>
                <th>Criado em</th>
                <th style={{ width: 80 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar">
                        {u.full_name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.full_name || 'Sem nome'}</span>
                      {u.id === myProfile?.id && <span style={{ fontSize: 11, color: '#57606a', background: '#f6f8fa', border: '1px solid #d0d7de', borderRadius: 20, padding: '1px 6px' }}>Você</span>}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><span className={`status-badge ${roleColors[u.role]}`}>{roleLabel[u.role]}</span></td>
                  <td style={{ color: '#57606a' }}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn-icon" onClick={() => { setEditing(u); setModalOpen(true) }}><Edit2 size={14} /></button>
                      <button className="btn-icon" onClick={() => handleDelete(u.id)} style={{ color: '#cf222e' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <UserModal user={editing} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); fetch() }} />
      )}
    </div>
  )
}
