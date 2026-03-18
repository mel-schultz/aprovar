'use client'

import { X } from 'lucide-react'

export function Button({ children, variant = 'primary', size = 'md', loading, className = '', style = {}, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer',
    border: 'none', borderRadius: 'var(--radius-sm)', transition: 'all .15s',
    whiteSpace: 'nowrap',
  }
  const variants = {
    primary:   { background: 'var(--brand)',     color: '#fff' },
    secondary: { background: 'var(--surface-3)', color: 'var(--text)', border: '1.5px solid var(--border)' },
    danger:    { background: 'var(--danger)',     color: '#fff' },
    ghost:     { background: 'transparent',      color: 'var(--text-2)' },
    outline:   { background: 'transparent',      color: 'var(--brand)', border: '1.5px solid var(--brand)' },
  }
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13 },
    md: { padding: '10px 18px', fontSize: 14 },
    lg: { padding: '13px 24px', fontSize: 15 },
  }
  return (
    <button
      style={{ ...base, ...variants[variant], ...sizes[size], opacity: loading ? .6 : 1, ...style }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .6s linear infinite' }} />
      )}
      {children}
    </button>
  )
}

export function Card({ children, style = {}, ...props }) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', ...style }} {...props}>
      {children}
    </div>
  )
}

export function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto', padding: 28, margin: '0 16px' }}>
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

export function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label>{label}</label>}
      {children}
      {error && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    pending:  { label: 'Pendente',   cls: 'badge-pending'  },
    approved: { label: 'Aprovado',   cls: 'badge-approved' },
    rejected: { label: 'Recusado',   cls: 'badge-rejected' },
    revision: { label: 'Em revisão', cls: 'badge-revision' },
  }
  const { label, cls } = map[status] || { label: status, cls: '' }
  return <span className={`badge ${cls}`}>{label}</span>
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      {Icon && (
        <div style={{ margin: '0 auto 16px', width: 56, height: 56, background: 'var(--brand-light)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={26} color="var(--brand)" />
        </div>
      )}
      <h3 style={{ fontSize: 17, marginBottom: 8 }}>{title}</h3>
      {description && <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>{description}</p>}
      {action}
    </div>
  )
}
