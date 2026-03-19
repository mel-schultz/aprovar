'use client'

import { insertClientWithApproverCount, updateClientWithApproverCount } from '../../lib/supabase/queries'

import { useState, useEffect } from 'react'
import {
  Plus, Users, Trash2, Edit2, Shield, User,
  Eye, EyeOff, Search, ToggleLeft, ToggleRight,
  Building2, UserCheck, ChevronRight,
} from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { Button, Modal, FormField, EmptyState } from '../../components/ui'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

/* ── helpers ──────────────────────────────────────────────────── */
const ROLE_CFG = {
  admin:  { label: 'Administrador', color: 'var(--brand)', bg: 'var(--brand-light)', Icon: Shield },
  client: { label: 'Cliente',       color: '#8b5cf6',      bg: '#ede9fe',            Icon: User   },
}
function RoleBadge({ role }) {
  const cfg = ROLE_CFG[role] || ROLE_CFG.client
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:cfg.bg, color:cfg.color, borderRadius:99, padding:'3px 10px', fontSize:12, fontWeight:500 }}>
      <cfg.Icon size={12} />{cfg.label}
    </span>
  )
}
function StatusDot({ active }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, color: active ? 'var(--brand)' : 'var(--text-3)' }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background: active ? 'var(--brand)' : 'var(--text-3)', display:'inline-block' }} />
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}
function Tab({ label, active, count, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:'10px 20px', fontFamily:'var(--font-body)', fontSize:14, fontWeight:500,
      border:'none', borderBottom: active ? '2px solid var(--brand)' : '2px solid transparent',
      background:'transparent', cursor:'pointer', color: active ? 'var(--brand)' : 'var(--text-2)',
      display:'flex', alignItems:'center', gap:7, transition:'color .15s', whiteSpace:'nowrap',
    }}>
      {label}
      {count != null && (
        <span style={{ background: active ? 'var(--brand)' : 'var(--surface-3)', color: active ? '#fff' : 'var(--text-2)', borderRadius:99, padding:'1px 8px', fontSize:11, fontWeight:600 }}>{count}</span>
      )}
    </button>
  )
}

/* ── Formulário de usuário do sistema ────────────────────────── */
function SystemUserForm({ initial = {}, clients, onSave, onCancel, isEdit = false }) {
  const [form, setForm] = useState({ full_name:'', email:'', password:'', role:'client', phone:'', company:'', linked_client_id:'', is_active:true, ...initial })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  async function submit(e) { e.preventDefault(); setLoading(true); await onSave(form); setLoading(false) }

  return (
    <form onSubmit={submit}>
      {/* Role selector */}
      <FormField label="Nível de acesso *">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {Object.entries(ROLE_CFG).map(([val, cfg]) => (
            <button key={val} type="button" onClick={() => set('role', val)} style={{
              display:'flex', alignItems:'center', gap:10, padding:'12px 14px',
              borderRadius:'var(--radius-sm)', cursor:'pointer', textAlign:'left',
              border:`2px solid ${form.role === val ? cfg.color : 'var(--border)'}`,
              background: form.role === val ? cfg.bg : 'var(--surface-3)', transition:'all .15s',
            }}>
              <div style={{ width:32, height:32, borderRadius:8, background: form.role === val ? cfg.color : 'var(--border-2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <cfg.Icon size={16} color="#fff" />
              </div>
              <div>
                <p style={{ fontWeight:600, fontSize:13, color: form.role === val ? cfg.color : 'var(--text)', marginBottom:2 }}>{cfg.label}</p>
                <p style={{ fontSize:11, color:'var(--text-3)' }}>{val === 'admin' ? 'Acesso total' : 'Portal de aprovação'}</p>
              </div>
            </button>
          ))}
        </div>
      </FormField>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
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
      <FormField label={isEdit ? 'Nova senha (em branco = não altera)' : 'Senha *'}>
        <div style={{ position:'relative' }}>
          <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required={!isEdit} minLength={6} style={{ paddingRight:40 }} />
          <button type="button" onClick={() => setShowPw(s => !s)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', display:'flex', color:'var(--text-3)' }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </FormField>

      {form.role === 'admin' && (
        <FormField label="Empresa">
          <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Agência XYZ" />
        </FormField>
      )}
      {form.role === 'client' && (
        <FormField label="Cliente vinculado">
          <select value={form.linked_client_id} onChange={e => set('linked_client_id', e.target.value)}>
            <option value="">— Nenhum cliente —</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <p style={{ fontSize:11, color:'var(--text-3)', marginTop:4 }}>O usuário verá apenas os entregáveis deste cliente.</p>
        </FormField>
      )}
      {isEdit && (
        <FormField label="Status">
          <div style={{ display:'flex', gap:10 }}>
            {[true, false].map(val => (
              <button key={String(val)} type="button" onClick={() => set('is_active', val)} style={{
                flex:1, padding:'8px 12px', borderRadius:'var(--radius-sm)', cursor:'pointer', fontSize:13, fontWeight:500,
                border:`1.5px solid ${form.is_active === val ? (val ? 'var(--brand)' : 'var(--danger)') : 'var(--border)'}`,
                background: form.is_active === val ? (val ? 'var(--brand-light)' : '#fee2e2') : 'var(--surface-3)',
                color: form.is_active === val ? (val ? 'var(--brand)' : 'var(--danger)') : 'var(--text-2)',
              }}>
                {val ? 'Ativo' : 'Inativo'}
              </button>
            ))}
          </div>
        </FormField>
      )}
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>{isEdit ? 'Salvar' : 'Criar usuário'}</Button>
      </div>
    </form>
  )
}

/* ── Formulário de cliente da plataforma ─────────────────────── */
function ClientForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ name:'', email:'', whatsapp:'', notes:'', ...initial })
  const [loading, setLoading] = useState(false)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  async function submit(e) { e.preventDefault(); setLoading(true); await onSave(form); setLoading(false) }
  return (
    <form onSubmit={submit}>
      <FormField label="Nome do cliente *"><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Empresa XYZ" required /></FormField>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <FormField label="E-mail"><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contato@empresa.com" /></FormField>
        <FormField label="WhatsApp"><input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+55 11 9..." /></FormField>
      </div>
      <FormField label="Observações"><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Contexto sobre o cliente..." /></FormField>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>Salvar</Button>
      </div>
    </form>
  )
}

/* ── Formulário de aprovadores ───────────────────────────────── */
function ApproversPanel({ clientId, clientName, onClose }) {
  const supabase = createClient()
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name:'', email:'', whatsapp:'' })
  const [loading, setLoading] = useState(false)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  useEffect(() => {
    supabase.from('approvers').select('*').eq('client_id', clientId)
      .then(({ data }) => setList(data || []))
  }, [clientId])

  async function add(e) {
    e.preventDefault(); if (!form.name) return; setLoading(true)
    const { data, error } = await supabase.from('approvers').insert({ ...form, client_id: clientId }).select().single()
    if (error) { toast.error(error.message); setLoading(false); return }
    setList(l => [...l, data]); setForm({ name:'', email:'', whatsapp:'' })
    toast.success('Aprovador adicionado!'); setLoading(false)
  }
  async function remove(id) {
    await supabase.from('approvers').delete().eq('id', id)
    setList(l => l.filter(a => a.id !== id)); toast.success('Removido.')
  }

  return (
    <div>
      <p style={{ fontSize:13, color:'var(--text-2)', marginBottom:16 }}>Aprovadores do cliente <strong>{clientName}</strong></p>
      <form onSubmit={add} style={{ marginBottom:20, background:'var(--surface-3)', borderRadius:'var(--radius-sm)', padding:16 }}>
        <p style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Adicionar aprovador</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <FormField label="Nome *"><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Maria" required /></FormField>
          <FormField label="E-mail"><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="maria@..." /></FormField>
        </div>
        <FormField label="WhatsApp"><input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+55 11 9..." /></FormField>
        <Button type="submit" loading={loading} size="sm"><Plus size={13}/> Adicionar</Button>
      </form>
      {list.length === 0
        ? <p style={{ fontSize:13, color:'var(--text-3)', textAlign:'center', padding:'16px 0' }}>Nenhum aprovador cadastrado.</p>
        : list.map(a => (
          <div key={a.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'var(--surface-3)', borderRadius:8, marginBottom:6 }}>
            <div>
              <p style={{ fontSize:14, fontWeight:500 }}>{a.name}</p>
              <p style={{ fontSize:12, color:'var(--text-2)' }}>{a.email}{a.whatsapp && ` · ${a.whatsapp}`}</p>
            </div>
            <button onClick={() => remove(a.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--danger)', display:'flex' }}><Trash2 size={15} /></button>
          </div>
        ))
      }
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
        <Button variant="secondary" onClick={onClose}>Fechar</Button>
      </div>
    </div>
  )
}

/* ── ABA 1: Usuários do sistema ───────────────────────────────── */
function SystemUsersTab({ users, setUsers, clients, currentUserId }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const match = !q || [u.full_name, u.email, u.client_name].some(v => v?.toLowerCase().includes(q))
    return match && (roleFilter === 'all' || u.role === roleFilter)
  })

  async function handleCreate(form) {
    const res = await fetch('/api/users', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error); return }
    const cl = clients.find(c => c.id === form.linked_client_id)
    setUsers(u => [{ ...json.data, client_name: cl?.name || null }, ...u])
    setModal(null); toast.success('Usuário criado!')
  }

  async function handleEdit(form) {
    const id = modal.edit.id
    const body = { ...form }; if (!body.password) delete body.password
    const res = await fetch(`/api/users/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error); return }
    const cl = clients.find(c => c.id === form.linked_client_id)
    setUsers(u => u.map(usr => usr.id === id ? { ...usr, ...json.data, client_name: cl?.name || null } : usr))
    setModal(null); toast.success('Usuário atualizado!')
  }

  async function handleToggle(user) {
    const res = await fetch(`/api/users/${user.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ is_active: !user.is_active }) })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error); return }
    setUsers(u => u.map(usr => usr.id === user.id ? { ...usr, is_active: !usr.is_active } : usr))
    toast.success(user.is_active ? 'Usuário desativado.' : 'Usuário reativado.')
  }

  async function handleDelete(user) {
    if (!window.confirm(`Excluir permanentemente "${user.full_name || user.email}"?`)) return
    setDeleting(user.id)
    const res = await fetch(`/api/users/${user.id}`, { method:'DELETE' })
    const json = await res.json()
    setDeleting(null)
    if (!res.ok) { toast.error(json.error); return }
    setUsers(u => u.filter(usr => usr.id !== user.id)); toast.success('Usuário excluído.')
  }

  return (
    <div>
      {/* Filtros */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:1, minWidth:220, position:'relative' }}>
          <Search size={14} color="var(--text-3)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome, e-mail ou cliente..." style={{ paddingLeft:34 }} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['all','admin','client'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{ padding:'7px 14px', borderRadius:99, fontSize:12, fontWeight:500, cursor:'pointer', background: roleFilter === r ? 'var(--brand)' : 'var(--surface)', color: roleFilter === r ? '#fff' : 'var(--text-2)', border:`1px solid ${roleFilter === r ? 'var(--brand)' : 'var(--border)'}`, transition:'all .15s' }}>
              {{ all:'Todos', admin:'Admins', client:'Clientes' }[r]}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => setModal('create')}><Plus size={14}/> Novo usuário</Button>
      </div>

      {/* Tabela */}
      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum usuário encontrado" description="Ajuste os filtros ou crie um novo usuário." action={<Button onClick={() => setModal('create')}><Plus size={14}/> Criar</Button>} />
      ) : (
        <div style={{ overflowX:'auto' }}>
          {/* Header */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 0.8fr 0.8fr 100px', gap:10, padding:'8px 16px', fontSize:11, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.05em', borderBottom:'1px solid var(--border)', minWidth:700 }}>
            <span>Usuário</span><span>Cliente vinculado</span><span>Nível</span><span>Status</span><span>Criado</span><span />
          </div>
          {filtered.map((user, i) => (
            <div key={user.id} style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 0.8fr 0.8fr 100px', gap:10, padding:'13px 16px', alignItems:'center', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none', background: user.id === currentUserId ? '#f0fdf4' : 'transparent', opacity: user.is_active ? 1 : .55, minWidth:700, transition:'background .15s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:11, minWidth:0 }}>
                <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background: user.role === 'admin' ? 'var(--brand-light)' : '#ede9fe', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color: user.role === 'admin' ? 'var(--brand)' : '#8b5cf6' }}>
                  {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontWeight:600, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {user.full_name || '—'}
                    {user.id === currentUserId && <span style={{ fontSize:11, color:'var(--brand)', marginLeft:6, fontWeight:400 }}>(você)</span>}
                  </p>
                  <p style={{ fontSize:12, color:'var(--text-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</p>
                </div>
              </div>
              <span style={{ fontSize:13, color: user.client_name ? 'var(--text)' : 'var(--text-3)' }}>{user.client_name || '—'}</span>
              <RoleBadge role={user.role} />
              <StatusDot active={user.is_active} />
              <span style={{ fontSize:12, color:'var(--text-3)' }}>{user.created_at ? formatDistanceToNow(new Date(user.created_at), { locale:ptBR, addSuffix:true }) : '—'}</span>
              <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                <button onClick={() => setModal({ edit: user })} title="Editar" style={{ background:'var(--surface-3)', border:'none', borderRadius:6, padding:6, cursor:'pointer', display:'flex' }}><Edit2 size={14} color="var(--text-2)" /></button>
                <button onClick={() => handleToggle(user)} title={user.is_active ? 'Desativar' : 'Ativar'} disabled={user.id === currentUserId} style={{ background:'var(--surface-3)', border:'none', borderRadius:6, padding:6, cursor: user.id === currentUserId ? 'not-allowed' : 'pointer', display:'flex', opacity: user.id === currentUserId ? .35 : 1 }}>
                  {user.is_active ? <ToggleRight size={14} color="var(--brand)" /> : <ToggleLeft size={14} color="var(--text-3)" />}
                </button>
                <button onClick={() => handleDelete(user)} title="Excluir" disabled={user.id === currentUserId || deleting === user.id} style={{ background:'var(--surface-3)', border:'none', borderRadius:6, padding:6, cursor: user.id === currentUserId ? 'not-allowed' : 'pointer', display:'flex', opacity: user.id === currentUserId ? .35 : 1 }}>
                  <Trash2 size={14} color="var(--danger)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Novo usuário" width={560}>
        <SystemUserForm clients={clients} onSave={handleCreate} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={!!modal?.edit} onClose={() => setModal(null)} title="Editar usuário" width={560}>
        {modal?.edit && <SystemUserForm initial={modal.edit} clients={clients} onSave={handleEdit} onCancel={() => setModal(null)} isEdit />}
      </Modal>
    </div>
  )
}

/* ── ABA 2: Clientes da plataforma ───────────────────────────── */
function ClientsTab({ clients, setClients }) {
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = clients.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))

  async function handleSave(form) {
    if (modal === 'create') {
      const { data: { session } } = await supabase.auth.getSession()
      const { data, error } = await insertClientWithApproverCount(supabase, { ...form, profile_id: session.user.id })
      if (error) { toast.error(error.message); return }
      setClients(c => [data, ...c]); toast.success('Cliente criado!')
    } else if (modal?.edit) {
      const { data, error } = await updateClientWithApproverCount(supabase, form, modal.edit.id)
      if (error) { toast.error(error.message); return }
      setClients(c => c.map(cl => cl.id === data.id ? data : cl)); toast.success('Cliente atualizado!')
    }
    setModal(null)
  }

  async function handleDelete(id) {
    if (!window.confirm('Remover este cliente e todos os seus dados?')) return
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    setClients(c => c.filter(cl => cl.id !== id)); toast.success('Cliente removido.')
  }

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center' }}>
        <div style={{ flex:1, position:'relative' }}>
          <Search size={14} color="var(--text-3)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar clientes..." style={{ paddingLeft:34 }} />
        </div>
        <Button size="sm" onClick={() => setModal('create')}><Plus size={14}/> Novo cliente</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Building2} title="Nenhum cliente encontrado" description="Crie o primeiro cliente da plataforma." action={<Button onClick={() => setModal('create')}><Plus size={14}/> Criar cliente</Button>} />
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
          {filtered.map(client => (
            <div key={client.id} style={{ background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:18 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'var(--brand-light)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, color:'var(--brand)' }}>
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight:600, fontSize:14 }}>{client.name}</p>
                    <p style={{ fontSize:12, color:'var(--text-2)' }}>{client.email || 'Sem e-mail'}</p>
                  </div>
                </div>
                <div style={{ display:'flex', gap:5 }}>
                  <button onClick={() => setModal({ edit: client })} style={{ background:'var(--surface-3)', border:'none', borderRadius:6, padding:5, cursor:'pointer', display:'flex' }}><Edit2 size={13} color="var(--text-2)" /></button>
                  <button onClick={() => handleDelete(client.id)} style={{ background:'var(--surface-3)', border:'none', borderRadius:6, padding:5, cursor:'pointer', display:'flex' }}><Trash2 size={13} color="var(--danger)" /></button>
                </div>
              </div>
              {client.whatsapp && <p style={{ fontSize:12, color:'var(--text-2)', marginBottom:10 }}>{client.whatsapp}</p>}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--surface-3)', borderRadius:8, padding:'8px 12px' }}>
                <span style={{ fontSize:12, color:'var(--text-2)' }}>Aprovadores: <strong>{client.approvers?.[0]?.count || 0}</strong></span>
                <button onClick={() => setModal({ approvers: client })} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:'var(--brand)', fontSize:12, fontWeight:500 }}>
                  Gerenciar <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Novo cliente">
        <ClientForm onSave={handleSave} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={!!modal?.edit} onClose={() => setModal(null)} title="Editar cliente">
        {modal?.edit && <ClientForm initial={modal.edit} onSave={handleSave} onCancel={() => setModal(null)} />}
      </Modal>
      <Modal open={!!modal?.approvers} onClose={() => setModal(null)} title={`Aprovadores — ${modal?.approvers?.name}`} width={540}>
        {modal?.approvers && <ApproversPanel clientId={modal.approvers.id} clientName={modal.approvers.name} onClose={() => setModal(null)} />}
      </Modal>
    </div>
  )
}

/* ── ABA 3: Aprovadores (visão global) ───────────────────────── */
function ApproversTab({ approvers, setApprovers }) {
  const supabase = createClient()
  const [search, setSearch] = useState('')

  const filtered = approvers.filter(a => !search || [a.name, a.email, a.clients?.name].some(v => v?.toLowerCase().includes(search.toLowerCase())))

  async function handleDelete(id) {
    if (!window.confirm('Remover este aprovador?')) return
    const { error } = await supabase.from('approvers').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    setApprovers(a => a.filter(ap => ap.id !== id)); toast.success('Aprovador removido.')
  }

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ position:'relative' }}>
          <Search size={14} color="var(--text-3)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome, e-mail ou cliente..." style={{ paddingLeft:34 }} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={UserCheck} title="Nenhum aprovador encontrado" description="Adicione aprovadores pela aba Clientes." />
      ) : (
        <div style={{ background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1.5fr 1fr 60px', gap:10, padding:'8px 16px', fontSize:11, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.05em', borderBottom:'1px solid var(--border)' }}>
            <span>Nome</span><span>Contato</span><span>Cliente</span><span />
          </div>
          {filtered.map((a, i) => (
            <div key={a.id} style={{ display:'grid', gridTemplateColumns:'1.5fr 1.5fr 1fr 60px', gap:10, padding:'13px 16px', alignItems:'center', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'#ede9fe', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, color:'#8b5cf6', flexShrink:0 }}>
                  {(a.name || '?').charAt(0)}
                </div>
                <p style={{ fontWeight:500, fontSize:14 }}>{a.name}</p>
              </div>
              <div>
                {a.email && <p style={{ fontSize:13 }}>{a.email}</p>}
                {a.whatsapp && <p style={{ fontSize:12, color:'var(--text-2)' }}>{a.whatsapp}</p>}
              </div>
              <span style={{ fontSize:13, color:'var(--text-2)' }}>{a.clients?.name || '—'}</span>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button onClick={() => handleDelete(a.id)} style={{ background:'var(--surface-3)', border:'none', borderRadius:6, padding:6, cursor:'pointer', display:'flex' }}><Trash2 size={14} color="var(--danger)" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Componente principal ─────────────────────────────────────── */
export default function UsersClient({ initialSystemUsers, initialClients, initialApprovers, currentUserId }) {
  const [tab, setTab] = useState('users')
  const [systemUsers, setSystemUsers] = useState(initialSystemUsers)
  const [clients,     setClients]     = useState(initialClients)
  const [approvers,   setApprovers]   = useState(initialApprovers)

  const stats = [
    { label: 'Usuários do sistema',    value: systemUsers.length,  color: 'var(--brand)' },
    { label: 'Administradores',        value: systemUsers.filter(u => u.role === 'admin').length,  color: 'var(--brand)' },
    { label: 'Clientes (usuários)',    value: systemUsers.filter(u => u.role === 'client').length, color: '#8b5cf6' },
    { label: 'Clientes da plataforma', value: clients.length,      color: '#f59e0b' },
    { label: 'Aprovadores cadastrados',value: approvers.length,    color: '#0ea5e9' },
  ]

  return (
    <div className="page-enter">
      {/* Cabeçalho */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ marginBottom:4 }}>Gerenciar usuários</h1>
        <p style={{ color:'var(--text-2)', fontSize:14 }}>Administre todos os usuários, clientes e aprovadores do sistema.</p>
      </div>

      {/* Cards de métricas */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:12, marginBottom:28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px 18px' }}>
            <p style={{ fontSize:26, fontFamily:'var(--font-display)', fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</p>
            <p style={{ fontSize:12, color:'var(--text-2)', marginTop:4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
        <div style={{ display:'flex', borderBottom:'1px solid var(--border)', overflowX:'auto' }}>
          <Tab label="Usuários do sistema" active={tab === 'users'}     count={systemUsers.length} onClick={() => setTab('users')} />
          <Tab label="Clientes"            active={tab === 'clients'}   count={clients.length}     onClick={() => setTab('clients')} />
          <Tab label="Aprovadores"         active={tab === 'approvers'} count={approvers.length}   onClick={() => setTab('approvers')} />
        </div>
        <div style={{ padding:24 }}>
          {tab === 'users'     && <SystemUsersTab users={systemUsers} setUsers={setSystemUsers} clients={clients} currentUserId={currentUserId} />}
          {tab === 'clients'   && <ClientsTab     clients={clients}   setClients={setClients} />}
          {tab === 'approvers' && <ApproversTab   approvers={approvers} setApprovers={setApprovers} />}
        </div>
      </div>
    </div>
  )
}
