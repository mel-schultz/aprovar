'use client'

export default function SchedulePage() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Calendário
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>
        Visualize a agenda de posts agendados
      </p>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-2)' }}>
          Nenhum post agendado.
        </p>
      </div>
    </div>
  )
}
