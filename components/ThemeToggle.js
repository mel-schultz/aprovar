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
        padding: '12px 24px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
      }}
      title={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
    </button>
  )
}
