import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Client } from '../types'
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react'
import ClientModal from '../components/clients/ClientModal'
import toast from 'react-hot-toast'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('clients').select('*').order('name')
    setClients((data as Client[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este cliente?')) return
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Cliente excluído!'); fetch() }
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Clientes</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={16} /> Novo cliente
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="search-box" style={{ maxWidth: 320 }}>
            <Search size={14} color="#8c959f" />
            <input placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 13, color: '#57606a' }}>{filtered.length} cliente(s)</span>
        </div>
        <div className="table-container" style={{ marginTop: 12 }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#57606a' }}>Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Users size={40} />
              <h3>Nenhum cliente encontrado</h3>
              <p>Adicione seu primeiro cliente clicando no botão acima.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Empresa</th>
                  <th>Criado em</th>
                  <th style={{ width: 80 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>
                          {c.name[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{c.name}</span>
                      </div>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.company || '—'}</td>
                    <td style={{ color: '#57606a' }}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" onClick={() => { setEditing(c); setModalOpen(true) }} title="Editar">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn-icon" onClick={() => handleDelete(c.id)} title="Excluir" style={{ color: '#cf222e' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <ClientModal
          client={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetch() }}
        />
      )}
    </div>
  )
}
