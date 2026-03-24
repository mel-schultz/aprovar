'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '700px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>🎯</div>
          <h1 style={{ marginBottom: '16px', fontSize: '48px' }}>AprovaAí</h1>
          <p style={{ fontSize: '18px', marginBottom: '12px', color: '#cbd5e1' }}>
            Sistema moderno de gerenciamento de aprovações
          </p>
          <p style={{ color: '#64748b' }}>Simplifique seu workflow de aprovações com design elegante</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
          <Link href="/login">
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
              🚀 Começar Agora
            </button>
          </Link>
          <Link href="/login">
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
              📝 Criar Conta
            </button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <FeatureCard icon="👥" title="Usuários" desc="Gestão completa" />
          <FeatureCard icon="🏢" title="Clientes" desc="Organizado" />
          <FeatureCard icon="📦" title="Projetos" desc="Controle total" />
          <FeatureCard icon="✅" title="Aprovações" desc="Workflow fluido" />
        </div>

        <div className="card" style={{ marginTop: '40px', textAlign: 'center' }}>
          <h3>Por que usar AprovaAí?</h3>
          <ul style={{ textAlign: 'left', marginTop: '20px' }}>
            <li style={{ marginBottom: '12px' }}>✨ Design moderno e intuitivo</li>
            <li style={{ marginBottom: '12px' }}>⚡ Rápido e responsivo</li>
            <li style={{ marginBottom: '12px' }}>🔐 Segurança em primeiro lugar</li>
            <li style={{ marginBottom: '12px' }}>📊 Dashboard interativo</li>
          </ul>
        </div>

        <p style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          © 2024 AprovaAí. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <h3 style={{ marginBottom: '4px', fontSize: '14px' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{desc}</p>
    </div>
  )
}
