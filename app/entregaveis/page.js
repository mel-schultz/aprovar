'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Entregaveis() {
  const [entregaveis, setEntregaveis] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '' })

  const handleAddEntregavel = (e) => {
    e.preventDefault()
    setEntregaveis([...entregaveis, { ...formData, id: Date.now(), status: 'pendente' }])
    setFormData({ titulo: '', descricao: '', cliente: '', dataEntrega: '', arquivo: '' })
    setShowForm(false)
    alert('✅ Entregável cadastrado!')
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#f5f5f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Entregáveis</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            ➕ Novo Entregável
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2>Novo Entregável</h2>
            <form onSubmit={handleAddEntregavel}>
              <input
                type="text"
                placeholder="Título"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '15px' }}
              />
              <textarea
                placeholder="Descrição"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '15px', minHeight: '100px' }}
              />
              <input
                type="text"
                placeholder="Cliente"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '15px' }}
              />
              <input
                type="date"
                value={formData.dataEntrega}
                onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '15px' }}
              />
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, arquivo: e.target.files[0]?.name || '' })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '15px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">Salvar</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table className="table">
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th>Título</th>
                <th>Cliente</th>
                <th>Data Entrega</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {entregaveis.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Nenhum entregável cadastrado</td></tr>
              ) : (
                entregaveis.map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.titulo}</strong></td>
                    <td>{e.cliente}</td>
                    <td>{e.dataEntrega}</td>
                    <td><span className="status-badge status-pending">Pendente</span></td>
                    <td><button className="btn btn-secondary" style={{ fontSize: '12px', padding: '5px 10px' }}>Aprovar</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <div style={{ width: '250px', background: '#1a1a1a', color: 'white', padding: '20px', overflowY: 'auto', height: '100vh' }}>
      <h2 style={{ marginBottom: '30px' }}>🎯 AprovaAí</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link href="/dashboard" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link href="/clientes" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Clientes</Link>
        <Link href="/entregaveis" style={{ padding: '10px', color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>Entregáveis</Link>
        <Link href="/calendario" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Calendário</Link>
        <Link href="/aprovacoes" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Aprovações</Link>
      </nav>
    </div>
  )
}
