'use client'

export default function TeamPage() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Equipe
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>
        Gerencie os membros da sua equipe
      </p>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-2)' }}>
          Nenhum membro adicionado.
        </p>
      </div>
    </div>
  )
}
