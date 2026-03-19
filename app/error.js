'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-2)', textAlign: 'center', padding: 24,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, background: '#fee2e2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px', fontSize: 32,
      }}>
        ⚠️
      </div>
      <h1 style={{ fontSize: 24, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
        Algo deu errado
      </h1>
      <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 24, maxWidth: 380 }}>
        {error?.message || 'Ocorreu um erro inesperado. Tente novamente.'}
      </p>
      <button
        onClick={reset}
        style={{
          background: 'var(--brand)', color: '#fff', border: 'none',
          borderRadius: 'var(--radius-sm)', padding: '10px 20px',
          fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}
      >
        Tentar novamente
      </button>
    </div>
  )
}
