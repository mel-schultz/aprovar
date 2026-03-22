'use client'

import Link from 'next/link'
import { CheckSquare, Clock, Users, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react'
import { Card, StatusBadge } from '../../components/ui'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function StatCard({ icon: Icon, label, value, color = 'var(--brand)' }) {
  return (
    <Card style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>{label}</p>
          <p style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 700, color }}>{value}</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={color} />
        </div>
      </div>
    </Card>
  )
}

export default function DashboardClient({ profile, stats, recent }) {
  // Validar dados
  if (!stats || !recent) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ margin: '0 auto', color: '#f59e0b' }} />
        <p style={{ color: 'var(--text-2)', fontSize: 15, marginTop: 12 }}>Carregando dados...</p>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 4 }}>
          Olá, {profile?.full_name?.split(' ')[0] || 'bem-vindo'}!
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
          Aqui está o resumo das suas aprovações.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={Users}       label="Clientes ativos"      value={stats.clients || 0}   />
        <StatCard icon={Clock}       label="Aguardando aprovação" value={stats.pending || 0}   color="var(--accent)" />
        <StatCard icon={CheckSquare} label="Aprovados"             value={stats.approved || 0}  color="var(--brand)" />
        <StatCard icon={TrendingUp}  label="Agendados"             value={stats.scheduled || 0} color="#8b5cf6" />
      </div>

      <Card>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16 }}>Entregáveis recentes</h2>
          <Link href="/approvals" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--brand)', fontSize: 13, fontWeight: 500 }}>
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        {!recent || recent.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Nenhum entregável ainda.</p>
            <Link href="/approvals" style={{ color: 'var(--brand)', fontWeight: 600, fontSize: 14, display: 'inline-block', marginTop: 8 }}>
              Criar primeiro entregável →
            </Link>
          </div>
        ) : (
          recent.map((d, i) => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{d.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {d.clients?.name ? `${d.clients.name} · ` : ''}{formatDistanceToNow(new Date(d.created_at), { locale: ptBR, addSuffix: true })}
                </p>
              </div>
              <StatusBadge status={d.status} />
            </div>
          ))
        )}
      </Card>
    </div>
  )
}
