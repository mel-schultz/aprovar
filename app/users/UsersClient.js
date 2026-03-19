'use client'

import { useState } from 'react'
import {
  Plus, Users, Trash2, Edit2, Shield, User,
  Eye, EyeOff, Search, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { Button, Card, Modal, FormField, EmptyState } from '../../components/ui'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

const ROLE_CONFIG = {
  admin:  { label: 'Administrador', color: 'var(--brand)',   bg: 'var(--brand-light)',  icon: Shield },
  client: { label: 'Cliente',       color: '#8b5cf6',        bg: '#ede9fe',             icon: User   },
}

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.client
  const Icon = cfg.icon
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: cfg.bg, color: cfg.color, borderRadius: 99, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>
      <Icon size={12} />
      {cfg.label}
    </span>
  )
}

function StatusDot({ active }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: active ? 'var(--brand)' : 'var(--text-3)' }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: active ? 'var(--brand)' : 'var(--text-3)', display: 'inline-block' }} />
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}

function UserForm({ initial = {}, clients, onSave, onCancel, isEdit = false }) {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', role: 'client',
    phone: '', company: '', linked_client_id: '',
    is_active: true,
    ...initial,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(form)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Papel */}
      <FormField label="Nível de acesso *">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {Object.entries(ROLE_CONFIG).map(([value, cfg]) => {
            const Icon = cfg.icon
            const active = form.role === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => set('role', value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left',
                  border: `2px solid ${active ? cfg.color : 'var(--border)'}`,
                  background: active ? cfg.bg : 'var(--surface-3)',
                  transition: 'all .15s',
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? cfg.color : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="#fff" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13, color: active ? cfg.color : 'var(--text)', marginBottom: 2 }}>{cfg.label}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {value === 'admin' ? 'Acesso total' : 'Portal de aprovação'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </FormField>

      {/* Dados pessoais */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Nome completo">
          <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="João Silva" />
        </FormField>
        <FormField label="Telefone">
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+55 11 9..." />
        </FormField>
      </div>

      <FormField label="E-mail *">
        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="joao@empresa.com" required />
      </FormField>

      <FormField label={isEdit ? 'Nova senha (deixe em branco para não alterar)' : 'Senha *'}>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={e => set('password', e.target.value)}
            placeholder="••••••••"
            required={!isEdit}
            minLength={6}
            style={{ paddingRight: 40 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-3)' }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </FormField>

      {/* Campo empresa (só para admin) */}
      {form.role === 'admin' && (
        <FormField label="Empresa">
          <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Agência XYZ" />
        </FormField>
      )}

      {/* Vínculo com cliente (só para client) */}
      {form.role === 'client' && (
        <FormField label="Cliente vinculado">
          <select value={form.linked_client_id} onChange={e => set('linked_client_id', e.target.value)}>
            <option value="">— Nenhum cliente —</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
            O cliente só verá os entregáveis do cliente vinculado.
          </p>
        </FormField>
      )}

      {/* Status (só na edição) */}
      {isEdit && (
        <FormField label="Status">
          <div style={{ display: 'flex', gap: 10 }}>
            {[true, false].map(val => (
              <button
                key={String(val)}
                type="button"
                onClick={() => set('is_active', val)}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  border: `1.5px solid ${form.is_active === val ? (val ? 'var(--brand)' : 'var(--danger)') : 'var(--border)'}`,
                  background: form.is_active === val ? (val ? 'var(--brand-light)' : '#fee2e2') : 'var(--surface-3)',
                  color: form.is_active === val ? (val ? 'var(--brand)' : 'var(--danger)') : 'var(--text-2)',
                  transition: 'all .15s',
                }}
              >
                {val ? 'Ativo' : 'Inativo'}
              </button>
            ))}
          </div>
        </FormField>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>
          {isEdit ? 'Salvar alterações' : 'Criar usuário'}
        </Button>
      </div>
    </form>
  )
}

export default function UsersClient({ initialUsers, clients, currentUserId }) {
  const [users, setUsers] = useState(initialUsers)
  const [modal, setModal] = useState(null) // null | 'create' | { edit: user } | { view: user }
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)

  // Filtros
  const filtered = users.filter(u => {
    const matchSearch = !search || [u.full_name, u.email, u.client_name].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  async function handleCreate(form) {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error); return }
    // Enriquecer com client_name
    const client = clients.find(c => c.id === form.linked_client_id)
    setUsers(u => [{ ...json.data, client_name: client?.name || null }, ...u])
    setModal(null)
    toast.success('Usuário criado com sucesso!')
  }

  async function handleEdit(form) {
    const id = modal.edit.id
    const body = { ...form }
    if (!body.password) delete body.password // não enviar se vazio
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error); return }
    const client = clients.find(c => c.id === form.linked_client_id)
    setUsers(u => u.map(usr => usr.id === id ? { ...usr, ...json.data, client_name: client?.name || null } : usr))
    setModal(null)
    toast.success('Usuário atualizado!')
  }

  async function handleToggleActive(user) {
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !user.is_active }),
    })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error); return }
    setUsers(u => u.map(usr => usr.id === user.id ? { ...usr, is_active: !usr.is_active } : usr))
    toast.success(user.is_active ? 'Usuário desativado.' : 'Usuário reativado.')
  }

  async function handleDelete(user) {
    if (!window.confirm(`Excluir permanentemente "${user.full_name || user.email}"? Esta ação não pode ser desfeita.`)) return
    setDeleting(user.id)
    const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
    const json = await res.json()
    setDeleting(null)
    if (!res.ok) { toast.error(json.error); return }
    setUsers(u => u.filter(usr => usr.id !== user.id))
    toast.success('Usuário excluído.')
  }

  const adminCount  = users.filter(u => u.role === 'admin').length
  const clientCount = users.filter(u => u.role === 'client').length
  const activeCount = users.filter(u => u.is_active).length

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Usuários</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
            Gerencie administradores e clientes do sistema.
          </p>
        </div>
        <Button onClick={() => setModal('create')}><Plus size={16} /> Novo usuário</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total de usuários',   value: users.length,  color: 'var(--text)' },
          { label: 'Administradores',     value: adminCount,    color: 'var(--brand)' },
          { label: 'Clientes',            value: clientCount,   color: '#8b5cf6' },
        ].map(s => (
          <Card key={s.label} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <p style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} color="var(--text-3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou cliente..."
            style={{ paddingLeft: 36 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'admin', 'client'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                background: roleFilter === r ? 'var(--brand)' : 'var(--surface)',
                color: roleFilter === r ? '#fff' : 'var(--text-2)',
                border: `1px solid ${roleFilter === r ? 'var(--brand)' : 'var(--border)'}`,
                transition: 'all .15s',
              }}
            >
              {{ all: 'Todos', admin: 'Administradores', client: 'Clientes' }[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="Nenhum usuário encontrado"
            description="Crie o primeiro usuário ou ajuste os filtros."
            action={<Button onClick={() => setModal('create')}><Plus size={16} /> Criar usuário</Button>}
          />
        </Card>
      ) : (
        <Card>
          {/* Header da tabela */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr auto', gap: 12, padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            <span>Usuário</span>
            <span>Cliente vinculado</span>
            <span>Nível</span>
            <span>Status</span>
            <span>Criado</span>
            <span />
          </div>

          {filtered.map((user, i) => (
            <div
              key={user.id}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr auto',
                gap: 12, padding: '14px 20px', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                background: user.id === currentUserId ? 'var(--brand-light)' : 'transparent',
                opacity: user.is_active ? 1 : .55,
              }}
            >
              {/* Usuário */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: user.role === 'admin' ? 'var(--brand-light)' : '#ede9fe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                  color: user.role === 'admin' ? 'var(--brand)' : '#8b5cf6',
                }}>
                  {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.full_name || '—'}
                    {user.id === currentUserId && <span style={{ fontSize: 11, color: 'var(--brand)', marginLeft: 6, fontWeight: 400 }}>(você)</span>}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                </div>
              </div>

              {/* Cliente vinculado */}
              <span style={{ fontSize: 13, color: user.client_name ? 'var(--text)' : 'var(--text-3)' }}>
                {user.client_name || '—'}
              </span>

              {/* Role */}
              <RoleBadge role={user.role} />

              {/* Status */}
              <StatusDot active={user.is_active} />

              {/* Data */}
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {user.created_at ? formatDistanceToNow(new Date(user.created_at), { locale: ptBR, addSuffix: true }) : '—'}
              </span>

              {/* Ações */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => setModal({ edit: user })}
                  title="Editar"
                  style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', display: 'flex' }}
                >
                  <Edit2 size={14} color="var(--text-2)" />
                </button>
                <button
                  onClick={() => handleToggleActive(user)}
                  title={user.is_active ? 'Desativar' : 'Ativar'}
                  disabled={user.id === currentUserId}
                  style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 6, padding: 6, cursor: user.id === currentUserId ? 'not-allowed' : 'pointer', display: 'flex', opacity: user.id === currentUserId ? .4 : 1 }}
                >
                  {user.is_active
                    ? <ToggleRight size={14} color="var(--brand)" />
                    : <ToggleLeft  size={14} color="var(--text-3)" />
                  }
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  title="Excluir"
                  disabled={user.id === currentUserId || deleting === user.id}
                  style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 6, padding: 6, cursor: user.id === currentUserId ? 'not-allowed' : 'pointer', display: 'flex', opacity: user.id === currentUserId ? .4 : 1 }}
                >
                  <Trash2 size={14} color="var(--danger)" />
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Modal: Criar */}
      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Novo usuário" width={560}>
        <UserForm clients={clients} onSave={handleCreate} onCancel={() => setModal(null)} />
      </Modal>

      {/* Modal: Editar */}
      <Modal open={!!modal?.edit} onClose={() => setModal(null)} title="Editar usuário" width={560}>
        {modal?.edit && (
          <UserForm
            initial={modal.edit}
            clients={clients}
            onSave={handleEdit}
            onCancel={() => setModal(null)}
            isEdit
          />
        )}
      </Modal>
    </div>
  )
}
