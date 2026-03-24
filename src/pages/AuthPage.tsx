import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User, RefreshCw } from 'lucide-react'

type Step = 'login' | 'register' | 'verify'

export default function AuthPage() {
  const [step, setStep] = useState<Step>('login')
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [resendCooldown, setResendCooldown] = useState(0)

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ full_name: '', email: '', password: '', confirm: '' })

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendCooldown])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    })
    setLoading(false)
    if (error) toast.error(error.message)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirm) {
      toast.error('Senhas não coincidem')
      return
    }
    if (registerData.password.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: { full_name: registerData.full_name },
        emailRedirectTo: undefined,
      },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setPendingEmail(registerData.email)
    setStep('verify')
    setResendCooldown(60)
    toast.success('Código enviado para seu e-mail!')
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const token = otp.join('')
    if (token.length < 6) {
      toast.error('Digite o código completo')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token,
      type: 'signup',
    })
    setLoading(false)
    if (error) {
      toast.error('Código inválido ou expirado')
    } else {
      toast.success('E-mail verificado com sucesso!')
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setLoading(true)
    const { error } = await supabase.auth.resend({ type: 'signup', email: pendingEmail })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Código reenviado!')
      setResendCooldown(60)
      setOtp(['', '', '', '', '', ''])
    }
  }

  if (step === 'verify') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-text">Approve</div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ddf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Mail size={24} color="#0969da" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Verifique seu e-mail</h2>
            <p style={{ fontSize: 14, color: '#57606a', margin: 0 }}>
              Digite o código de 6 dígitos enviado para<br />
              <strong style={{ color: '#1f2328' }}>{pendingEmail}</strong>
            </p>
          </div>
          <div className="otp-inputs">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { otpRefs.current[i] = el }}
                className="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
              />
            ))}
          </div>
          <button
            className="btn btn-primary w-100"
            onClick={handleVerify}
            disabled={loading || otp.join('').length < 6}
            style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
          >
            {loading ? 'Verificando...' : 'Verificar e-mail'}
          </button>
          <div style={{ textAlign: 'center' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              style={{ gap: 6 }}
            >
              <RefreshCw size={14} />
              {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código'}
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              className="btn"
              style={{ background: 'none', border: 'none', color: '#57606a', fontSize: 13, cursor: 'pointer' }}
              onClick={() => { setStep('login'); setTab('login') }}
            >
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-text">Approve</div>
          <p style={{ fontSize: 13, color: '#57606a', margin: '4px 0 0' }}>Plataforma de aprovação de conteúdo</p>
        </div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setStep('login') }}>
            Entrar
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setStep('register') }}>
            Cadastrar
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8c959f' }} />
                <input
                  className="form-input"
                  type="email"
                  placeholder="seu@email.com"
                  value={loginData.email}
                  onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))}
                  required
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8c959f' }} />
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
                  required
                  style={{ paddingLeft: 34, paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8c959f', padding: 0 }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8c959f' }} />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Seu nome"
                  value={registerData.full_name}
                  onChange={e => setRegisterData(d => ({ ...d, full_name: e.target.value }))}
                  required
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8c959f' }} />
                <input
                  className="form-input"
                  type="email"
                  placeholder="seu@email.com"
                  value={registerData.email}
                  onChange={e => setRegisterData(d => ({ ...d, email: e.target.value }))}
                  required
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8c959f' }} />
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 caracteres"
                  value={registerData.password}
                  onChange={e => setRegisterData(d => ({ ...d, password: e.target.value }))}
                  required
                  style={{ paddingLeft: 34, paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8c959f', padding: 0 }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar senha</label>
              <input
                className="form-input"
                type="password"
                placeholder="Repita a senha"
                value={registerData.confirm}
                onChange={e => setRegisterData(d => ({ ...d, confirm: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
