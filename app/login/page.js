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
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message || 'Erro ao fazer login')
      } else {
        setSuccess('Login realizado com sucesso!')
        setTimeout(() => router.push('/dashboard'), 1500)
      }
    } catch (err) {
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
      if (!name.trim()) { setError('Nome é obrigatório'); setLoading(false); return }
      if (!email.includes('@')) { setError('Email inválido'); setLoading(false); return }
      if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres'); setLoading(false); return }

      const { data, error: signupErr } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signupErr) {
        setError(signupErr.message || 'Erro ao cadastrar')
      } else if (data.user) {
        setSuccess('Conta criada! Verifique seu email para confirmar.')
        setEmail(''); setPassword(''); setName('')
        setTimeout(() => { setTab('login'); setSuccess('') }, 3000)
      }
    } catch (err) {
      setError('Erro inesperado: ' + (err.message || 'Tente novamente'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      {/* HEADER */}
      <header className="login-header">
        <Link href="/" className="login-logo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>AprovaAí</span>
        </Link>
      </header>

      {/* MAIN */}
      <main className="login-main">
        <div className="login-container">
          {/* TITLE */}
          <div className="login-title-area">
            <h1 className="login-title">
              {tab === 'login' ? 'Entrar na sua conta' : 'Criar nova conta'}
            </h1>
            <p className="login-subtitle">
              {tab === 'login'
                ? 'Bem-vindo de volta ao AprovaAí'
                : 'Comece a gerenciar suas aprovações hoje'}
            </p>
          </div>

          {/* CARD */}
          <div className="login-card">
            {/* TABS */}
            <div className="login-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={tab === 'login'}
                className={`login-tab${tab === 'login' ? ' login-tab--active' : ''}`}
                onClick={() => { setTab('login'); setError(''); setSuccess('') }}
              >
                Entrar
              </button>
              <button
                role="tab"
                aria-selected={tab === 'signup'}
                className={`login-tab${tab === 'signup' ? ' login-tab--active' : ''}`}
                onClick={() => { setTab('signup'); setError(''); setSuccess('') }}
              >
                Cadastro
              </button>
            </div>

            {/* ALERTS */}
            {error && (
              <div className="alert alert-error" role="alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={tab === 'login' ? handleLogin : handleSignup} noValidate>
              {tab === 'signup' && (
                <div className="form-group">
                  <label htmlFor="name">Nome completo</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                    disabled={loading}
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Endereço de email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <div className="login-label-row">
                  <label htmlFor="password">Senha</label>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  disabled={loading}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary login-submit"
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Carregando...
                  </>
                ) : tab === 'login' ? (
                  'Entrar'
                ) : (
                  'Criar conta'
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="login-divider" aria-hidden="true">
              <span>Contas de demonstração</span>
            </div>

            {/* DEMO CREDENTIALS */}
            <div className="login-demo">
              <div className="login-demo-item">
                <span className="login-demo-label">Admin</span>
                <code className="login-demo-code">admin@test.com</code>
                <span className="login-demo-sep">/</span>
                <code className="login-demo-code">teste123456</code>
              </div>
              <div className="login-demo-item">
                <span className="login-demo-label">Novo usuário</span>
                <span className="login-demo-hint">Crie uma conta com qualquer email</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <p className="login-footer">
            <Link href="/">← Voltar para a página inicial</Link>
          </p>
        </div>
      </main>

      <style>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--color-canvas-default);
        }

        /* Header */
        .login-header {
          border-bottom: 1px solid var(--color-border-muted);
          padding: 0 24px;
          height: 56px;
          display: flex;
          align-items: center;
        }

        .login-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: var(--color-fg-default);
          text-decoration: none;
        }

        .login-logo:hover {
          text-decoration: none;
          color: var(--color-fg-default);
        }

        .login-logo svg {
          color: var(--color-accent-fg);
        }

        /* Main */
        .login-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
        }

        /* Title area */
        .login-title-area {
          text-align: center;
          margin-bottom: 20px;
        }

        .login-title {
          font-size: 22px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin-bottom: 6px;
        }

        .login-subtitle {
          font-size: 14px;
          color: var(--color-fg-muted);
          margin: 0;
        }

        /* Card */
        .login-card {
          background: var(--color-canvas-subtle);
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          padding: 24px;
          box-shadow: var(--color-shadow-small);
        }

        /* Tabs */
        .login-tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border-muted);
          margin-bottom: 20px;
          gap: 0;
        }

        .login-tab {
          flex: 1;
          padding: 8px 12px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-fg-muted);
          font-family: inherit;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .login-tab:hover {
          color: var(--color-fg-default);
        }

        .login-tab--active {
          color: var(--color-fg-default);
          border-bottom-color: var(--color-accent-fg);
          font-weight: 600;
        }

        /* Alerts */
        .login-card .alert {
          margin-bottom: 16px;
          font-size: 13px;
        }

        /* Label row */
        .login-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .login-label-row label {
          margin-bottom: 0;
        }

        /* Submit button */
        .login-submit {
          width: 100%;
          justify-content: center;
          padding: 8px 16px;
          font-size: 14px;
          margin-top: 8px;
        }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0 16px;
          color: var(--color-fg-subtle);
          font-size: 12px;
        }

        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border-muted);
        }

        /* Demo credentials */
        .login-demo {
          background: var(--color-canvas-inset);
          border: 1px solid var(--color-border-muted);
          border-radius: 6px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-demo-item {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          font-size: 12px;
        }

        .login-demo-label {
          font-weight: 600;
          color: var(--color-fg-default);
          min-width: 80px;
        }

        .login-demo-code {
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace;
          font-size: 11px;
          background: var(--color-neutral-muted);
          color: var(--color-fg-default);
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid var(--color-border-muted);
        }

        .login-demo-sep {
          color: var(--color-fg-subtle);
        }

        .login-demo-hint {
          color: var(--color-fg-muted);
          font-style: italic;
        }

        /* Footer */
        .login-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: var(--color-fg-muted);
        }

        .login-footer a {
          color: var(--color-accent-fg);
          text-decoration: none;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
