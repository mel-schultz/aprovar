import { useState } from 'react'
import { Client } from '../../types'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

interface Props {
  client?: Client | null
  onClose: () => void
  onSaved: () => void
}

export default function ClientModal({ client, onClose, onSaved }: Props) {
  const isEdit = !!client
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    company: client?.company || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form }
    let error
    if (isEdit) {
      ({ error } = await supabase.from('clients').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', client!.id))
    } else {
      ({ error } = await supabase.from('clients').insert([payload]))
    }
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(isEdit ? 'Cliente atualizado!' : 'Cliente criado!')
      onSaved()
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{isEdit ? 'Editar Cliente' : 'Novo Cliente'}</h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail *</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Empresa</label>
                <input className="form-input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
