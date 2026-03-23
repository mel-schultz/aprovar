'use client'

import { useTheme } from '../app/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '6px 8px',
        background: 'transparent',
        border: '1px solid transparent',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        fontFamily: 'inherit',
        color: 'var(--color-fg-muted)',
        transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
        textAlign: 'left',
        marginBottom: '4px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--hover-bg)'
        e.currentTarget.style.borderColor = 'var(--color-border-default)'
        e.currentTarget.style.color = 'var(--color-fg-default)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.borderColor = 'transparent'
        e.currentTarget.style.color = 'var(--color-fg-muted)'
      }}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      {theme === 'dark' ? (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.061l-.707.707a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.735l.707-.707a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-.707.707a.75.75 0 0 1-1.06-1.06l.707-.707a.75.75 0 0 1 1.06 0ZM8 0a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 0Zm0 13.5a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 13.5ZM2.343 2.343a.75.75 0 0 1 1.061 0l.707.707a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.735-.215l-.707-.707a.75.75 0 0 1 0-1.06Zm9.193 9.193a.75.75 0 0 1 1.06 0l.707.707a.75.75 0 0 1-1.06 1.06l-.707-.707a.75.75 0 0 1 0-1.06ZM16 8a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 16 8ZM2.5 8a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 2.5 8Z" />
          </svg>
          <span>Tema claro</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.499 5.499 0 1 0 7.678-7.678Z" />
          </svg>
          <span>Tema escuro</span>
        </>
      )}
    </button>
  )
}
