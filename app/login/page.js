'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (err) {
      setError(err.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (err) {
      setError(err.message)
    } else {
      setError('✅ Verifique seu email para confirmar o cadastro')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '60px auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>AprovaAí</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setTab('login')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            background: tab === 'login' ? '#0066cc' : '#e0e0e0',
            color: tab === 'login' ? 'white' : '#333',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Entrar
        </button>
        <button
          onClick={() => setTab('signup')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            background: tab === 'signup' ? '#0066cc' : '#e0e0e0',
            color: tab === 'signup' ? 'white' : '#333',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Cadastro
        </button>
      </div>

      {error && (
        <div style={{ background: error.includes('✅') ? '#d4edda' : '#f8d7da', color: error.includes('✅') ? '#155724' : '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
        {tab === 'signup' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Carregando...' : tab === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        <Link href="/">← Voltar</Link>
      </p>
    </div>
  )
}
