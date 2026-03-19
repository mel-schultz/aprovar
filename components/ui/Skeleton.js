'use client'

export function Skeleton({ width = '100%', height = 16, radius = 8, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'var(--surface-3)',
        animation: 'skeletonPulse 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', padding: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Skeleton width={42} height={42} radius={10} />
        <div style={{ flex: 1 }}>
          <Skeleton height={14} style={{ marginBottom: 8, width: '60%' }} />
          <Skeleton height={12} style={{ width: '40%' }} />
        </div>
      </div>
      <Skeleton height={12} style={{ marginBottom: 8 }} />
      <Skeleton height={12} style={{ width: '80%' }} />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < rows - 1 ? '1px solid var(--border)' : 'none' }}>
          <Skeleton width={36} height={36} radius={8} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Skeleton height={13} style={{ marginBottom: 6, width: `${40 + Math.random() * 30}%` }} />
            <Skeleton height={11} style={{ width: `${20 + Math.random() * 20}%` }} />
          </div>
          <Skeleton width={72} height={24} radius={99} />
        </div>
      ))}
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .45; }
        }
      `}</style>
    </div>
  )
}
