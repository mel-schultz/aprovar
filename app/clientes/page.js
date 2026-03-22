'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', cnpj: '', telefone: '', endereco: '' })

  const handleAddCliente = (e) => {
    e.preventDefault()
    setClientes([...clientes, { ...formData, id: Date.now() }])
    setFormData({ nome: '', email: '', cnpj: '', telefone: '', endereco: '' })
    setShowForm(false)
    alert('✅ Cliente cadastrado!')
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#f5f5f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Clientes</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            ➕ Novo Cliente
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2>Cadastro de Cliente</h2>
            <form onSubmit={handleAddCliente}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="Nome da Empresa"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <input
                  type="text"
                  placeholder="CNPJ"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <input
                  type="text"
                  placeholder="Endereço"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', gridColumn: '1 / -1' }}
                />
              </div>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
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
                <th>Nome</th>
                <th>Email</th>
                <th>CNPJ</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Nenhum cliente cadastrado</td></tr>
              ) : (
                clientes.map(c => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>
                    <td>{c.email}</td>
                    <td>{c.cnpj}</td>
                    <td>{c.telefone}</td>
                    <td><button className="btn btn-secondary" style={{ fontSize: '12px', padding: '5px 10px' }}>Editar</button></td>
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
        <Link href="/clientes" style={{ padding: '10px', color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>Clientes</Link>
        <Link href="/entregaveis" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Entregáveis</Link>
        <Link href="/calendario" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Calendário</Link>
        <Link href="/aprovacoes" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Aprovações</Link>
      </nav>
    </div>
  )
}
