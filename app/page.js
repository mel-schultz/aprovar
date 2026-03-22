import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '100px auto' }}>
      <h1>🎯 AprovaAí</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Sistema de Gerenciamento de Aprovações de Entregáveis
      </p>

      <div style={{ display: 'grid', gap: '15px' }}>
        <Link href="/login" className="btn btn-primary" style={{ display: 'block', padding: '15px' }}>
          Entrar no Sistema
        </Link>
        <Link href="/login?tab=cadastro" className="btn btn-secondary" style={{ display: 'block', padding: '15px' }}>
          Criar Conta
        </Link>
      </div>

      <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid #ddd', color: '#666', fontSize: '14px' }}>
        <h3>Funcionalidades:</h3>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>✅ Gerenciamento de Usuários</li>
          <li>✅ Cadastro de Clientes</li>
          <li>✅ Entregáveis Completos</li>
          <li>✅ Calendário Integrado</li>
          <li>✅ Aprovações com Workflows</li>
        </ul>
      </div>
    </div>
  )
}
