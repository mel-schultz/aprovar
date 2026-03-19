'use client'

import { X } from 'lucide-react'

/**
 * Componente Modal Corrigido
 * 
 * Alterações realizadas:
 * - Centralização vertical garantida (minHeight: 100vh)
 * - Scroll responsivo (overflow: auto)
 * - Espaçamento adequado (padding: 20px)
 * - Sem cortes (maxHeight: 85vh)
 * - Compatível com todos navegadores modernos
 */
export default function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null
  return (
    <div
      style={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'rgba(15,23,42,.45)', 
        backdropFilter: 'blur(4px)',
        minHeight: '100vh',
        overflow: 'auto',
        padding: '20px'
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ 
        background: 'var(--surface)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-lg)', 
        width: '100%', 
        maxWidth: width, 
        maxHeight: '85vh', 
        overflowY: 'auto', 
        padding: 28, 
        margin: 'auto 16px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'var(--surface-3)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}>
            <X size={16} color="var(--text-2)" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
