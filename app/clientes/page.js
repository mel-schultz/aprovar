'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!nome.trim() || !email.trim()) {
      alert('Preencha todos os campos')
      return
    }
    setClientes([...clientes, { id: Date.now(), nome, email }])
    setNome('')
    setEmail('')
  }

  const handleDelete = (id) => {
    if (confirm('Deletar este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <h1>Clientes</h1>

        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>Adicionar Cliente</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Nome</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Empresa" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@empresa.com" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Adicionar</button>
          </form>
        </div>

        {clientes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p>Nenhum cliente cadastrado</p>
          </div>
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(c => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>
                    <td>{c.email}</td>
                    <td>
                      <button onClick={() => handleDelete(c.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <h2>🎯 AprovaAí</h2>
      <nav style={{ marginBottom: '40px' }}>
        <NavLink href="/dashboard" label="Dashboard" icon="📊" />
        <NavLink href="/clientes" label="Clientes" icon="🏢" active />
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" />
        <NavLink href="/aprovacoes" label="Aprovações" icon="✅" />
      </nav>
      <button onClick={onLogout} className="btn btn-secondary" style={{ width: '100%' }}>
        🚪 Sair
      </button>
    </div>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link href={href} className={`nav-item ${active ? 'active' : ''}`} style={{ justifyContent: 'flex-start' }}>
      <span>{icon}</span>
      <a>{label}</a>
    </Link>
  )
}
