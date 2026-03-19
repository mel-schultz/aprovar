export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--surface-2)',
    }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid var(--brand-light)',
        borderTopColor: 'var(--brand)',
        borderRadius: '50%',
        animation: 'spin .6s linear infinite',
      }} />
    </div>
  )
}
