'use client'

export default function ClientsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Clientes
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>
        Gerencie seus clientes e suas aprovações
      </p>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-2)' }}>
          Nenhum cliente cadastrado ainda.
        </p>
      </div>
    </div>
  )
}
