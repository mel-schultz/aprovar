'use client'

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Bem-vindo ao Aprovar
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>
        Plataforma de aprovações e agendamento de conteúdo
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
      }}>
        {/* Card 1 */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Aprovações
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            Gerencie solicitações de aprovação de conteúdo
          </p>
        </div>

        {/* Card 2 */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Clientes
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            Gerencie seus clientes e suas aprovações
          </p>
        </div>

        {/* Card 3 */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📅</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Calendário
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            Visualize a agenda de posts agendados
          </p>
        </div>

        {/* Card 4 */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Configurações
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            Configure sua conta e preferências
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          Estatísticas
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--brand)', marginBottom: '8px' }}>
              0
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-2)' }}>
              Aprovações pendentes
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--brand)', marginBottom: '8px' }}>
              0
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-2)' }}>
              Clientes ativos
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--brand)', marginBottom: '8px' }}>
              0
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-2)' }}>
              Posts agendados
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
