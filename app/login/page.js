'use client'

import { useState } from 'react'
import { CheckSquare } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { Button, FormField } from '../../components/ui'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const supabase = createClient()
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '', company: '' })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        // Full page reload para garantir que os cookies de sessão
        // estejam disponíveis quando o middleware interceptar /dashboard
        window.location.href = '/dashboard'
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name, company: form.company } },
        })
        if (error) throw error
        toast.success('Conta criada! Verifique seu e-mail para confirmar o cadastro.')
        setMode('login')
        setLoading(false)
      }
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--surface-2)' }}>
      {/* Formulário */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, background: 'var(--brand)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={22} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--brand)' }}>
              Aprovar
            </span>
          </div>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
            Plataforma de aprovações e agendamento de conteúdo
          </p>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', padding: 36, width: '100%', maxWidth: 420 }}>
          <h2 style={{ fontSize: 22, marginBottom: 4 }}>
            {mode === 'login' ? 'Entrar na conta' : 'Criar conta'}
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 28 }}>
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Preencha os dados para começar.'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <FormField label="Seu nome">
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="João Silva"
                    required
                  />
                </FormField>
                <FormField label="Empresa / Agência">
                  <input
                    value={form.company}
                    onChange={e => set('company', e.target.value)}
                    placeholder="Minha Agência"
                  />
                </FormField>
              </>
            )}
            <FormField label="E-mail">
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="voce@empresa.com"
                required
              />
            </FormField>
            <FormField label="Senha">
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </FormField>
            <Button
              type="submit"
              loading={loading}
              style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 4 }}
            >
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-2)' }}>
            {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            <button
              onClick={() => setMode(m => m === 'login' ? 'signup' : 'login')}
              style={{ color: 'var(--brand)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
            >
              {mode === 'login' ? 'Criar agora' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>

      {/* Hero */}
      <div style={{ flex: 1, background: 'var(--brand)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        <div style={{ maxWidth: 420, color: '#fff' }}>
          <h1 style={{ fontSize: 36, lineHeight: 1.15, marginBottom: 20, color: '#fff' }}>
            Chega de caos nas aprovações de conteúdo
          </h1>
          <p style={{ fontSize: 16, opacity: .85, lineHeight: 1.7, marginBottom: 36 }}>
            Envie, aprove e agende posts em um só lugar. Seus clientes aprovam com um clique — você publica no piloto automático.
          </p>
          {[
            '67% menos pedidos de refação',
            '75% menos reuniões de aprovação',
            '29% menos contratos perdidos',
          ].map(stat => (
            <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,.25)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckSquare size={14} color="#fff" />
              </div>
              <span style={{ fontSize: 15, opacity: .9 }}>{stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
