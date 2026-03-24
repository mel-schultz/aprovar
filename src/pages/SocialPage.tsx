import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Client, SocialAccount } from '../types'
import { Plus, Globe, Trash2, Link, Unlink } from 'lucide-react'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

const platforms = [
  { value: 'instagram', label: 'Instagram', color: '#fce4ec', textColor: '#880e4f' },
  { value: 'facebook', label: 'Facebook', color: '#e3f2fd', textColor: '#0d47a1' },
  { value: 'twitter', label: 'Twitter / X', color: '#e1f5fe', textColor: '#01579b' },
  { value: 'linkedin', label: 'LinkedIn', color: '#e8f4fd', textColor: '#0a66c2' },
  { value: 'tiktok', label: 'TikTok', color: '#f3e5f5', textColor: '#4a0072' },
  { value: 'youtube', label: 'YouTube', color: '#ffebee', textColor: '#b71c1c' },
]

function SocialModal({ clients, onClose, onSaved }: { clients: Client[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ client_id: '', platform: 'instagram', account_name: '', account_url: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('social_accounts').insert([{ ...form, is_connected: true }])
    setLoading(false)
    if (error) toast.error(error.message)
    else { toast.success('Conta adicionada!'); onSaved() }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Nova Conta de Rede Social</h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select className="form-select" value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))} required>
                <option value="">Selecione um cliente</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Plataforma *</label>
              <select className="form-select" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                {platforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nome da conta *</label>
              <input className="form-input" placeholder="@nomeconta" value={form.account_name} onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">URL do perfil</label>
              <input className="form-input" type="url" placeholder="https://..." value={form.account_url} onChange={e => setForm(f => ({ ...f, account_url: e.target.value }))} />
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

export default function SocialPage() {
  const [accounts, setAccounts] = useState<(SocialAccount & { client?: Client })[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [filterClient, setFilterClient] = useState('')

  const fetch = useCallback(async () => {
    setLoading(true)
    const [{ data: acc }, { data: cli }] = await Promise.all([
      supabase.from('social_accounts').select('*, client:clients(id, name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('*').order('name'),
    ])
    setAccounts((acc as any) || [])
    setClients((cli as Client[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const toggleConnection = async (acc: SocialAccount) => {
    const { error } = await supabase.from('social_accounts').update({ is_connected: !acc.is_connected }).eq('id', acc.id)
    if (error) toast.error(error.message)
    else { toast.success(`Conta ${acc.is_connected ? 'desconectada' : 'conectada'}!`); fetch() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta conta?')) return
    await supabase.from('social_accounts').delete().eq('id', id)
    fetch()
  }

  const filtered = filterClient ? accounts.filter(a => (a as any).client?.id === filterClient) : accounts

  const getPlatform = (p: string) => platforms.find(x => x.value === p)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Redes Sociais</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Adicionar conta
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <select className="form-select" style={{ maxWidth: 240 }} value={filterClient} onChange={e => setFilterClient(e.target.value)}>
          <option value="">Todos os clientes</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#57606a' }}>Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Globe size={40} />
          <h3>Nenhuma conta cadastrada</h3>
          <p>Adicione contas de redes sociais dos seus clientes.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map(acc => {
            const plat = getPlatform(acc.platform)
            return (
              <div key={acc.id} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className={`platform-badge platform-${acc.platform}`}>
                    {plat?.label || acc.platform}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      className="btn-icon"
                      onClick={() => toggleConnection(acc)}
                      title={acc.is_connected ? 'Desconectar' : 'Conectar'}
                      style={{ color: acc.is_connected ? '#1a7f37' : '#57606a' }}
                    >
                      {acc.is_connected ? <Link size={14} /> : <Unlink size={14} />}
                    </button>
                    <button className="btn-icon" onClick={() => handleDelete(acc.id)} style={{ color: '#cf222e' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{acc.account_name}</div>
                <div style={{ fontSize: 12, color: '#57606a', marginBottom: 8 }}>
                  Cliente: {(acc as any).client?.name || '—'}
                </div>
                {acc.account_url && (
                  <a href={acc.account_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#0969da' }}>
                    Abrir perfil ↗
                  </a>
                )}
                <div style={{ marginTop: 10 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                    background: acc.is_connected ? '#dafbe1' : '#f6f8fa',
                    color: acc.is_connected ? '#1a7f37' : '#57606a',
                    border: `1px solid ${acc.is_connected ? '#82e29b' : '#d0d7de'}`
                  }}>
                    {acc.is_connected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <SocialModal clients={clients} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); fetch() }} />
      )}
    </div>
  )
}
