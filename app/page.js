'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
        
        <h1 style={{ marginBottom: '16px' }}>AprovaAí Light</h1>
        <p style={{ fontSize: '16px', marginBottom: '40px', color: '#cbd5e1' }}>
          Sistema leve e moderno de gerenciamento de aprovações de projetos
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
          <Link href="/login">
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              🚀 Entrar
            </button>
          </Link>
          <Link href="/login">
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              📝 Cadastro
            </button>
          </Link>
        </div>

        <div style={{ 
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          marginTop: '40px'
        }}>
          <h3>✨ Principais Recursos</h3>
          <div style={{ textAlign: 'left', marginTop: '20px' }}>
            <p>✅ Gerenciamento de clientes</p>
            <p>✅ Controle de entregáveis</p>
            <p>✅ Workflow de aprovações</p>
            <p>✅ Design moderno responsivo</p>
          </div>
        </div>

        <p style={{ marginTop: '40px', fontSize: '12px', color: '#64748b' }}>
          © 2024 AprovaAí Light
        </p>
      </div>
    </div>
  )
}
