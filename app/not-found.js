import Link from 'next/link'

export const metadata = { title: '404 — Página não encontrada' }

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-2)', textAlign: 'center', padding: 24,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, background: 'var(--brand-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px', fontSize: 32,
      }}>
        🔍
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
        Página não encontrada
      </h1>
      <p style={{ color: 'var(--text-2)', fontSize: 15, marginBottom: 28, maxWidth: 380 }}>
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        href="/dashboard"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--brand)', color: '#fff', borderRadius: 'var(--radius-sm)',
          padding: '10px 20px', fontSize: 14, fontWeight: 500, textDecoration: 'none',
        }}
      >
        Voltar ao dashboard
      </Link>
    </div>
  )
}
