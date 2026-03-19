'use client'

import { useState } from 'react'
import { CheckSquare, Clock, CheckCircle, XCircle, RefreshCw, LogOut, ExternalLink } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { StatusBadge, Card } from '../../components/ui'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

const NETWORK_COLORS = { instagram: '#e1306c', facebook: '#1877f2', youtube: '#ff0000', tiktok: '#010101' }

function ApproveModal({ deliverable, onClose, onDecision }) {
  const supabase = createClient()
  const [decision, setDecision] = useState(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (!decision) return
    setSubmitting(true)
    await supabase.from('approval_events').insert({
      deliverable_id: deliverable.id,
      action: decision,
      comment: comment || null,
    })
    await supabase.from('deliverables')
      .update({ status: decision, updated_at: new Date().toISOString() })
      .eq('id', deliverable.id)
    toast.success(decision === 'approved' ? 'Conteúdo aprovado!' : decision === 'revision' ? 'Revisão solicitada.' : 'Conteúdo recusado.')
    onDecision(deliverable.id, decision)
    setSubmitting(false)
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,.5)', backdropFilter: 'blur(4px)', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 560, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontSize: 18, marginBottom: 4 }}>{deliverable.title}</h3>
        {deliverable.description && <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>{deliverable.description}</p>}

        {/* Preview do arquivo */}
        {deliverable.file_url && (
          <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
            {deliverable.file_type?.startsWith('image') ? (
              <img src={deliverable.file_url} alt="preview" style={{ maxWidth: '100%', borderRadius: 8, display: 'block' }} />
            ) : deliverable.file_type?.startsWith('video') ? (
              <video src={deliverable.file_url} controls style={{ maxWidth: '100%', borderRadius: 8 }} />
            ) : (
              <a href={deliverable.file_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand)', fontWeight: 500, fontSize: 14 }}>
                <ExternalLink size={16} /> Abrir arquivo
              </a>
            )}
          </div>
        )}

        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Qual é a sua decisão?</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { value: 'approved', icon: CheckCircle, label: 'Aprovar',          color: 'var(--brand)', light: '#d1fae5' },
            { value: 'revision', icon: RefreshCw,  label: 'Pedir ajuste',     color: '#8b5cf6',      light: '#ede9fe' },
            { value: 'rejected', icon: XCircle,    label: 'Recusar',          color: 'var(--danger)', light: '#fee2e2' },
          ].map(({ value, icon: Icon, label, color, light }) => (
            <button
              key={value}
              onClick={() => setDecision(v => v === value ? null : value)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 12, border: `2px solid ${decision === value ? color : 'var(--border)'}`, background: decision === value ? light : 'var(--surface-3)', color: decision === value ? color : 'var(--text-2)', transition: 'all .15s' }}
            >
              <Icon size={20} />{label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Comentário {decision === 'revision' ? '(obrigatório)' : '(opcional)'}</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Descreva sua decisão..." />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 18px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--surface-3)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Cancelar</button>
          <button
            onClick={submit}
            disabled={!decision || (decision === 'revision' && !comment) || submitting}
            style={{ padding: '10px 18px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--brand)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, opacity: (!decision || (decision === 'revision' && !comment)) ? .5 : 1 }}
          >
            {submitting ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PortalClient({ profile, deliverables: initial, clientName }) {
  const supabase = createClient()
  const [deliverables, setDeliverables] = useState(initial)
  const [reviewing, setReviewing] = useState(null)

  function handleDecision(id, status) {
    setDeliverables(d => d.map(del => del.id === id ? { ...del, status } : del))
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.replace('/login')
  }

  const pending  = deliverables.filter(d => d.status === 'pending').length
  const approved = deliverables.filter(d => d.status === 'approved').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)' }}>
      {/* Topbar do portal */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'var(--brand)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={16} color="#fff" />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--brand)' }}>Aprovar</span>
            {clientName && <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 8 }}>— {clientName}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{profile?.full_name || profile?.email}</span>
          <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface-3)', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
        {/* Boas-vindas */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>
            Olá, {profile?.full_name?.split(' ')[0] || 'bem-vindo'}!
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
            Aqui estão os conteúdos aguardando a sua aprovação.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total de conteúdos', value: deliverables.length, color: 'var(--text)',    icon: CheckSquare },
            { label: 'Aguardando',          value: pending,             color: 'var(--accent)',  icon: Clock },
            { label: 'Aprovados',           value: approved,            color: 'var(--brand)',   icon: CheckCircle },
          ].map(s => (
            <Card key={s.label} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <p style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Lista de entregáveis */}
        {!profile?.linked_client_id ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ width: 56, height: 56, background: 'var(--surface-3)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckSquare size={26} color="var(--text-3)" />
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 8 }}>Nenhum conteúdo disponível</h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Sua conta ainda não está vinculada a um cliente. Entre em contato com a agência.</p>
            </div>
          </Card>
        ) : deliverables.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ width: 56, height: 56, background: 'var(--brand-light)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={26} color="var(--brand)" />
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 8 }}>Tudo em dia!</h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Não há conteúdos pendentes no momento.</p>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deliverables.map(d => (
              <Card key={d.id} style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 600, fontSize: 15 }}>{d.title}</p>
                      <StatusBadge status={d.status} />
                      {d.network && (
                        <span style={{ fontSize: 11, background: (NETWORK_COLORS[d.network] || 'var(--brand)') + '20', color: NETWORK_COLORS[d.network] || 'var(--brand)', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>
                          {d.network}
                        </span>
                      )}
                    </div>
                    {d.description && <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4, lineHeight: 1.5 }}>{d.description}</p>}
                    <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {formatDistanceToNow(new Date(d.created_at), { locale: ptBR, addSuffix: true })}
                      {d.scheduled_at && ` · Agendado para ${new Date(d.scheduled_at).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  {d.status === 'pending' && (
                    <button
                      onClick={() => setReviewing(d)}
                      style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                    >
                      Revisar e aprovar
                    </button>
                  )}
                  {d.status !== 'pending' && d.file_url && (
                    <a href={d.file_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--brand)', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
                      <ExternalLink size={14} /> Ver arquivo
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {reviewing && (
        <ApproveModal
          deliverable={reviewing}
          onClose={() => setReviewing(null)}
          onDecision={handleDecision}
        />
      )}
    </div>
  )
}
