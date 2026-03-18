import { useState } from 'react'
import { Check, X, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui'
import toast from 'react-hot-toast'

const PLANS = [
  {
    id: 'starter',
    name: 'Iniciante',
    price: { monthly: 26, quarterly: 23.40, yearly: 15.60 },
    description: 'Para freelancers e profissionais solo.',
    features: [
      { label: 'Até 3 clientes inclusos', ok: true },
      { label: 'Cliente adicional: R$ 26/mês', ok: true },
      { label: 'Aprovação via WhatsApp', ok: true },
      { label: 'Calendário de posts', ok: true },
      { label: 'Whitelabel (seu logo)', ok: true },
      { label: 'Google Drive + Canva + Zapier', ok: true },
      { label: 'Suporte via WhatsApp', ok: true },
      { label: 'Usuários adicionais', ok: false },
      { label: 'Agendamento nas redes sociais', ok: false },
    ],
  },
  {
    id: 'intermediate',
    name: 'Intermediário',
    price: { monthly: 36, quarterly: 32.40, yearly: 21.60 },
    description: 'Para agências pequenas com equipe.',
    features: [
      { label: 'Até 3 clientes inclusos', ok: true },
      { label: 'Cliente adicional: R$ 36/mês', ok: true },
      { label: 'Aprovação via WhatsApp', ok: true },
      { label: 'Calendário de posts', ok: true },
      { label: 'Whitelabel (seu logo)', ok: true },
      { label: 'Google Drive + Canva + Zapier', ok: true },
      { label: 'Suporte via WhatsApp', ok: true },
      { label: 'Até 5 usuários adicionais', ok: true },
      { label: 'Agendamento Instagram, Facebook, YouTube', ok: true },
    ],
    highlight: true,
  },
  {
    id: 'complete',
    name: 'Completo',
    price: { monthly: 42, quarterly: 37.80, yearly: 25.20 },
    description: 'Para agências que precisam de escala.',
    features: [
      { label: 'Até 3 clientes inclusos', ok: true },
      { label: 'Cliente adicional: R$ 42/mês', ok: true },
      { label: 'Aprovação via WhatsApp', ok: true },
      { label: 'Calendário de posts', ok: true },
      { label: 'Whitelabel (seu logo)', ok: true },
      { label: 'Google Drive + Canva + Zapier', ok: true },
      { label: 'Suporte via WhatsApp', ok: true },
      { label: 'Usuários ilimitados', ok: true },
      { label: 'Agendamento Instagram, Facebook, YouTube', ok: true },
    ],
  },
]

const CYCLES = [
  { id: 'monthly',   label: 'Mensal',   discount: null },
  { id: 'quarterly', label: 'Trimestral', discount: '10% off' },
  { id: 'yearly',    label: 'Anual',    discount: '40% off' },
]

export default function BillingPage() {
  const { profile, updateProfile } = useAuth()
  const [cycle, setCycle] = useState('monthly')
  const [loading, setLoading] = useState(null)

  async function handleSelect(planId) {
    setLoading(planId)
    // Em produção: redirecionar para Stripe Checkout
    // const { data } = await supabase.functions.invoke('create-checkout', { body: { plan: planId, cycle } })
    // window.location.href = data.url
    await new Promise(r => setTimeout(r, 1200))
    await updateProfile({ plan: planId })
    toast.success(`Plano ${planId} ativado! (simulação — integre o Stripe em produção)`)
    setLoading(null)
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 30, marginBottom: 8 }}>Escolha seu plano</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
          Plano atual: <strong style={{ color: 'var(--brand)', textTransform: 'capitalize' }}>{profile?.plan || 'trial'}</strong>
        </p>
      </div>

      {/* Cycle toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 36 }}>
        {CYCLES.map(c => (
          <button
            key={c.id}
            onClick={() => setCycle(c.id)}
            style={{
              padding: '8px 18px', borderRadius: 99, fontSize: 14, fontWeight: 500, cursor: 'pointer',
              background: cycle === c.id ? 'var(--brand)' : 'var(--surface)',
              color: cycle === c.id ? '#fff' : 'var(--text-2)',
              border: `1.5px solid ${cycle === c.id ? 'var(--brand)' : 'var(--border)'}`,
              transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {c.label}
            {c.discount && (
              <span style={{ fontSize: 11, background: cycle === c.id ? 'rgba(255,255,255,.25)' : 'var(--brand-light)', color: cycle === c.id ? '#fff' : 'var(--brand)', borderRadius: 99, padding: '1px 6px' }}>
                {c.discount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
        {PLANS.map(plan => {
          const price = plan.price[cycle]
          const isCurrent = profile?.plan === plan.id
          return (
            <div
              key={plan.id}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: plan.highlight ? '2px solid var(--brand)' : '1px solid var(--border)',
                boxShadow: plan.highlight ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                padding: 28,
                position: 'relative',
                transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--brand)', color: '#fff', borderRadius: 99, padding: '4px 16px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Zap size={12} /> Mais popular
                </div>
              )}

              <h2 style={{ fontSize: 20, marginBottom: 4 }}>{plan.name}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>{plan.description}</p>

              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 38 }}>
                  R$ {price.toFixed(2).replace('.', ',')}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>/mês</span>
                {cycle !== 'monthly' && (
                  <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                    {cycle === 'quarterly' ? 'Cobrado trimestralmente' : 'Cobrado anualmente'}
                  </p>
                )}
              </div>

              <Button
                onClick={() => handleSelect(plan.id)}
                loading={loading === plan.id}
                disabled={isCurrent}
                variant={plan.highlight ? 'primary' : 'outline'}
                style={{ width: '100%', justifyContent: 'center', marginBottom: 24, padding: 12 }}
              >
                {isCurrent ? 'Plano atual' : `Assinar ${plan.name}`}
              </Button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {f.ok
                      ? <Check size={16} color="var(--brand)" style={{ flexShrink: 0, marginTop: 1 }} />
                      : <X size={16} color="var(--text-3)" style={{ flexShrink: 0, marginTop: 1 }} />
                    }
                    <span style={{ fontSize: 13, color: f.ok ? 'var(--text)' : 'var(--text-3)' }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Custom plan */}
      <div style={{ textAlign: 'center', marginTop: 48 }}>
        <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 12 }}>Precisa de um plano sob medida?</p>
        <Button variant="secondary" onClick={() => window.open('https://wa.me/5561985560820', '_blank')}>
          Falar com o time via WhatsApp
        </Button>
      </div>
    </div>
  )
}
