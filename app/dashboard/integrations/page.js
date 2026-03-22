'use client'

export default function IntegrationsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Integrações
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>
        Configure integrações com outras plataformas
      </p>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-2)' }}>
          Nenhuma integração configurada.
        </p>
      </div>
    </div>
  )
}
