'use client'

export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Configurações
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>
        Configure sua conta e preferências
      </p>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Configurações gerais
        </h3>

        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Nome da empresa
            </label>
            <input
              type="text"
              placeholder="Sua empresa"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              disabled
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                opacity: 0.6,
              }}
            />
          </div>

          <button
            style={{
              background: 'var(--brand)',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              alignSelf: 'flex-start',
            }}
          >
            Salvar configurações
          </button>
        </div>
      </div>
    </div>
  )
}
