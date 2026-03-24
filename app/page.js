'use client'

import Link from 'next/link'
import { useTheme } from './ThemeContext'

export default function Home() {
  const { theme } = useTheme()

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* HERO */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 20px',
        textAlign: 'center',
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f5f6f8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* ANIMATED BACKGROUND ELEMENTS */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(74, 158, 255, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 115, 234, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-100px',
          right: '-100px',
          animation: 'float 6s ease-in-out infinite',
        }} />

        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(76, 175, 80, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 133, 77, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-50px',
          left: '-50px',
          animation: 'float 8s ease-in-out infinite 2s',
        }} />

        {/* CONTENT */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          {/* BADGE */}
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: theme === 'dark'
              ? 'rgba(74, 158, 255, 0.15)'
              : 'rgba(0, 115, 234, 0.1)',
            border: theme === 'dark'
              ? '1px solid rgba(74, 158, 255, 0.3)'
              : '1px solid rgba(0, 115, 234, 0.2)',
            borderRadius: '4px',
            marginBottom: '24px',
            fontSize: '12px',
            color: theme === 'dark' ? '#4a9eff' : '#0073ea',
            fontWeight: '600',
            letterSpacing: '0px',
          }}>
            ✨ Bem-vindo ao AprovaAí
          </div>

          {/* HEADING */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
            color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
          }}>
            Gerenciamento de Aprovações Moderno
          </h1>

          {/* SUBHEADING */}
          <p style={{
            fontSize: '16px',
            color: theme === 'dark' ? '#b0b0b0' : '#626262',
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
            <Link href="/login" className="btn btn-primary" style={{ fontSize: '14px', padding: '12px 24px' }}>
              🚀 Começar Agora
            </Link>
            <Link href="/login?tab=signup" className="btn btn-secondary" style={{ fontSize: '14px', padding: '12px 24px' }}>
              📝 Criar Conta
            </Link>
          </div>

          {/* FEATURES GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginTop: '60px',
          }}>
            <FeatureCard icon="👥" title="Usuários" desc="Admin, Atendimento, Cliente" theme={theme} />
            <FeatureCard icon="🏢" title="Clientes" desc="White label completo" theme={theme} />
            <FeatureCard icon="📦" title="Entregáveis" desc="Upload e gerenciamento" theme={theme} />
            <FeatureCard icon="📅" title="Calendário" desc="Tipo Google Agenda" theme={theme} />
            <FeatureCard icon="✅" title="Aprovações" desc="Workflow completo" theme={theme} />
            <FeatureCard icon="⚡" title="Moderno" desc="Design responsivo" theme={theme} />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: `1px solid ${theme === 'dark' ? '#3a3a3a' : '#e9ecef'}`,
        color: theme === 'dark' ? '#b0b0b0' : '#626262',
        fontSize: '13px',
        background: theme === 'dark' ? '#1e1e1e' : '#ffffff',
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

function FeatureCard({ icon, title, desc, theme }) {
  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '24px 20px',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '16px',
        fontWeight: '600',
        color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
      }}>
        {title}
      </h3>
      <p style={{ 
        margin: '0', 
        fontSize: '13px', 
        color: theme === 'dark' ? '#808080' : '#999999',
      }}>
        {desc}
      </p>
    </div>
  )
}
