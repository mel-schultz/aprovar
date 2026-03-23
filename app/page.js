'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* HERO */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        textAlign: 'center',
        background: `linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%),
                      radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* ANIMATED BACKGROUND */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderRadius: '50%',
          top: '-100px',
          right: '-100px',
          animation: 'float 6s ease-in-out infinite',
        }} />

        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          borderRadius: '50%',
          bottom: '-50px',
          left: '-50px',
          animation: 'float 8s ease-in-out infinite 2s',
        }} />

        {/* CONTENT */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '20px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#818cf8',
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}>
            ✨ Bem-vindo ao AprovaAí
          </div>

          <h1 style={{
            fontSize: '52px',
            fontWeight: '800',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2',
            letterSpacing: '-1px',
          }}>
            Gerenciamento de Aprovações Moderno
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#cbd5e1',
            marginBottom: '40px',
            lineHeight: '1.6',
          }}>
            Sistema completo para gerenciar clientes, entregáveis, calendário e aprovações em um único lugar.
          </p>

          {/* CTA BUTTONS */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '60px',
          }}>
            <Link href="/login" className="btn btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              🚀 Começar Agora
            </Link>
            <Link href="/login?tab=signup" className="btn btn-secondary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              📝 Criar Conta
            </Link>
          </div>

          {/* FEATURES GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginTop: '60px',
          }}>
            <FeatureCard icon="👥" title="Usuários" desc="Admin, Atendimento, Cliente" />
            <FeatureCard icon="🏢" title="Clientes" desc="White label completo" />
            <FeatureCard icon="📦" title="Entregáveis" desc="Upload e gerenciamento" />
            <FeatureCard icon="📅" title="Calendário" desc="Tipo Google Agenda" />
            <FeatureCard icon="✅" title="Aprovações" desc="Workflow completo" />
            <FeatureCard icon="⚡" title="Moderno" desc="Design responsivo" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(99, 102, 241, 0.1)',
        color: '#cbd5e1',
        fontSize: '13px',
      }}>
        <p>© 2024 AprovaAí. Desenvolvido com ❤️</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px 16px',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>{title}</h3>
      <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>{desc}</p>
    </div>
  )
}
