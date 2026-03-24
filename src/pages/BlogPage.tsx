import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { BlogPost, Client } from '../types'
import { Plus, FileText, Edit2, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

const statusLabel: Record<string, string> = { draft: 'Rascunho', review: 'Em revisão', published: 'Publicado' }

function BlogModal({ post, clients, onClose, onSaved }: { post?: BlogPost | null; clients: Client[]; onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth()
  const isEdit = !!post
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    client_id: post?.client_id || '',
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    status: post?.status || 'draft',
    scheduled_date: post?.scheduled_date ? post.scheduled_date.slice(0, 16) : '',
    cover_image_url: post?.cover_image_url || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, created_by: user?.id, scheduled_date: form.scheduled_date || null }
    let error
    if (isEdit) {
      ({ error } = await supabase.from('blog_posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', post!.id))
    } else {
      ({ error } = await supabase.from('blog_posts').insert([payload]))
    }
    setLoading(false)
    if (error) toast.error(error.message)
    else { toast.success(isEdit ? 'Post atualizado!' : 'Post criado!'); onSaved() }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{isEdit ? 'Editar Post' : 'Novo Post de Blog'}</h2>
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
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as typeof f.status }))}>
                  <option value="draft">Rascunho</option>
                  <option value="review">Em revisão</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Resumo</label>
              <input className="form-input" placeholder="Breve descrição do post" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Conteúdo *</label>
              <textarea className="form-textarea" style={{ minHeight: 160 }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Data de publicação</label>
                <input className="form-input" type="datetime-local" value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">URL da imagem de capa</label>
                <input className="form-input" type="url" placeholder="https://..." value={form.cover_image_url} onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))} />
              </div>
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

export default function BlogPage() {
  const [posts, setPosts] = useState<(BlogPost & { client?: Client })[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [filterStatus, setFilterStatus] = useState('')

  const fetch = useCallback(async () => {
    setLoading(true)
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('blog_posts').select('*, client:clients(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('*').order('name'),
    ])
    setPosts((p as any) || [])
    setClients((c as Client[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    toast.success('Post excluído!')
    fetch()
  }

  const filtered = filterStatus ? posts.filter(p => p.status === filterStatus) : posts

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Blog</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={16} /> Novo post
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <select className="form-select" style={{ maxWidth: 200 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="draft">Rascunho</option>
          <option value="review">Em revisão</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#57606a' }}>Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FileText size={40} />
          <h3>Nenhum post encontrado</h3>
          <p>Crie o primeiro post de blog.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map(post => (
            <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {post.cover_image_url && (
                <img src={post.cover_image_url} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`status-badge status-${post.status === 'review' ? 'pending' : post.status === 'published' ? 'published' : 'draft'}`}>
                  {statusLabel[post.status]}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn-icon" onClick={() => { setEditing(post); setModalOpen(true) }}><Edit2 size={14} /></button>
                  <button className="btn-icon" onClick={() => handleDelete(post.id)} style={{ color: '#cf222e' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2328' }}>{post.title}</div>
              {post.excerpt && <div style={{ fontSize: 13, color: '#57606a', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{post.excerpt}</div>}
              <div style={{ fontSize: 12, color: '#8c959f' }}>
                {(post as any).client?.name || '—'}
                {post.scheduled_date && ` · ${new Date(post.scheduled_date).toLocaleDateString('pt-BR')}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <BlogModal post={editing} clients={clients} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); fetch() }} />
      )}
    </div>
  )
}
