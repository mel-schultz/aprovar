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
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('📝 Tentando login com:', email)
      
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (err) {
        console.error('❌ Erro ao fazer login:', err.message)
        setError(err.message || 'Erro ao fazer login')
      } else {
        console.log('✅ Login sucesso')
        setSuccess('Login realizado com sucesso!')
        setTimeout(() => router.push('/dashboard'), 1500)
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err)
      setError('Erro inesperado: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validações
      if (!name.trim()) {
        setError('Nome é obrigatório')
        setLoading(false)
        return
      }

      if (!email.includes('@')) {
        setError('Email inválido')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Senha deve ter pelo menos 6 caracteres')
        setLoading(false)
        return
      }

      console.log('📝 Tentando cadastro com:', email)

      const { data, error: signupErr } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signupErr) {
        console.error('❌ Erro ao cadastrar:', signupErr.message)
        setError(signupErr.message || 'Erro ao cadastrar')
      } else if (data.user) {
        console.log('✅ Cadastro realizado:', data.user.email)
        setSuccess('✅ Conta criada! Verifique seu email para confirmar.')
        setEmail('')
        setPassword('')
        setName('')
        
        // Após 3 segundos, voltar para login
        setTimeout(() => {
          setTab('login')
          setSuccess('')
        }, 3000)
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err)
      setError('Erro inesperado: ' + (err.message || 'Tente novamente'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* LOGO */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <h1 style={{
            fontSize: '36px',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            🎯 AprovaAí
          </h1>
          <p style={{ color: '#cbd5e1', marginBottom: '0' }}>
            Sistema de Aprovações de Entregáveis
          </p>
        </div>

        {/* CARD */}
        <div className="card" style={{ marginBottom: '0' }}>
          {/* TABS */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '28px',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            padding: '4px',
            borderRadius: '12px',
          }}>
            <button
              onClick={() => {
                setTab('login')
                setError('')
                setSuccess('')
              }}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                background: tab === 'login' 
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'transparent',
                color: tab === 'login' ? 'white' : '#cbd5e1',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s',
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setTab('signup')
                setError('')
                setSuccess('')
              }}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                background: tab === 'signup' 
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'transparent',
                color: tab === 'signup' ? 'white' : '#cbd5e1',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s',
              }}
            >
              Cadastro
            </button>
          </div>

          {/* ALERTS */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <div>
                <strong>Erro</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '18px' }}>✅</span>
              <div>
                <strong>Sucesso</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>{success}</p>
              </div>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
            {tab === 'signup' && (
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                  Carregando...
                </>
              ) : tab === 'login' ? (
                <>🔓 Entrar</>
              ) : (
                <>✨ Criar Conta</>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '24px 0',
            opacity: 0.5,
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(99, 102, 241, 0.2)' }} />
            <span style={{ fontSize: '12px' }}>OU</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(99, 102, 241, 0.2)' }} />
          </div>

          {/* DEMO ACCOUNTS */}
          <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>Teste com as contas de demo:</strong>
            </p>
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '11px',
            }}>
              <p style={{ margin: '0 0 6px 0' }}>
                <strong>Admin:</strong> admin@test.com / teste123456
              </p>
              <p style={{ margin: '0' }}>
                <strong>Usuário novo:</strong> Crie uma conta com qualquer email
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#cbd5e1',
          fontSize: '13px',
        }}>
          <p>
            <Link href="/" style={{ color: '#6366f1' }}>← Voltar para Home</Link>
          </p>
          <p style={{ marginTop: '12px', opacity: 0.6 }}>
            © 2024 AprovaAí. Todos os direitos reservados.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
