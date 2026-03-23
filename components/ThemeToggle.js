'use client'

import { useTheme } from '@/app/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      style={{
        width: '100%',
        justifyContent: 'center',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 24px',
        borderRadius: '20px', /* Material Design 3 */
        border: '1px solid var(--md-sys-color-outline)',
        background: 'var(--md-sys-color-surface-container-high)',
        color: 'var(--md-sys-color-on-surface)',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      title={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
    </button>
  )
}
