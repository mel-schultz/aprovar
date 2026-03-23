'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('login')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setError('Verifique seu email para confirmar a conta')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
          <h2 style={{ margin: 0 }}>AprovaAí</h2>
        </div>

        {error && (
          <div style={{
            background: error.includes('Verifique') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: error.includes('Verifique') ? '#6ee7b7' : '#fca5a5',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
            border: error.includes('Verifique') ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setTab('login')}
            className={tab === 'login' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ flex: 1, justifyContent: 'center', border: 'none' }}
          >
            Entrar
          </button>
          <button
            onClick={() => setTab('signup')}
            className={tab === 'signup' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ flex: 1, justifyContent: 'center', border: 'none' }}
          >
            Cadastro
          </button>
        </div>

        <form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Carregando...' : tab === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', marginBottom: '8px', margin: 0 }}>Demo:</p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>teste@example.com</p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>teste123456</p>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '13px' }}>
            Voltar
          </Link>
        </div>
      </div>
    </div>
  )
}
