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
      <div className="card" style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎯</div>
          <h1 style={{ margin: '0 0 8px 0' }}>AprovaAí</h1>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '15px' }}>Sistema de Aprovações Moderno</p>
        </div>

        {error && (
          <div style={{
            background: error.includes('Verifique') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: error.includes('Verifique') ? '#6ee7b7' : '#fca5a5',
            padding: '14px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '13px',
            border: error.includes('Verifique') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setTab('login')}
            className={tab === 'login' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ width: '100%' }}
          >
            Entrar
          </button>
          <button
            onClick={() => setTab('signup')}
            className={tab === 'signup' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ width: '100%' }}
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
            style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }}
          >
            {loading ? '⏳ Carregando...' : tab === 'login' ? '🚀 Entrar' : '📝 Cadastrar'}
          </button>
        </form>

        <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <p style={{ fontSize: '12px', marginBottom: '8px', margin: 0 }}>🧪 Demo:</p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '6px 0' }}>Email: teste@example.com</p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '6px 0' }}>Senha: teste123456</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
            ← Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
}
