'use client'

export default function ApprovalsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Aprovações
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>
        Visualize e gerencie solicitações de aprovação
      </p>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-2)' }}>
          Nenhuma aprovação pendente.
        </p>
      </div>
    </div>
  )
}
