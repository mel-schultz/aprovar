import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui'
import toast from 'react-hot-toast'

export default function ApprovalPublicPage() {
  const { token } = useParams()
  const [deliverable, setDeliverable] = useState(null)
  const [client, setClient] = useState(null)
  const [approvers, setApprovers] = useState([])
  const [loading, setLoading] = useState(true)
  const [decision, setDecision] = useState(null) // 'approved' | 'rejected' | 'revision'
  const [comment, setComment] = useState('')
  const [selectedApprover, setSelectedApprover] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: del } = await supabase
        .from('deliverables')
        .select('*, clients(id, name, logo_url)')
        .eq('token', token)
        .single()
      if (!del) { setLoading(false); return }
      setDeliverable(del)
      setClient(del.clients)

      const { data: apps } = await supabase.from('approvers').select('*').eq('client_id', del.clients.id)
      setApprovers(apps || [])
      setLoading(false)
    }
    load()
  }, [token])

  async function submit() {
    if (!decision) return
    setSubmitting(true)
    const { error: evErr } = await supabase.from('approval_events').insert({
      deliverable_id: deliverable.id,
      approver_id: selectedApprover || null,
      action: decision,
      comment,
    })
    if (evErr) { toast.error('Erro ao registrar. Tente novamente.'); setSubmitting(false); return }
    await supabase.from('deliverables').update({ status: decision, updated_at: new Date().toISOString() }).eq('id', deliverable.id)
    setDone(true)
    setSubmitting(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)' }}>
      <p style={{ color: 'var(--text-2)' }}>Carregando...</p>
    </div>
  )

  if (!deliverable) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', textAlign: 'center', padding: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>Link inválido ou expirado</h2>
        <p style={{ color: 'var(--text-2)' }}>Solicite um novo link à sua agência.</p>
      </div>
    </div>
  )

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', textAlign: 'center', padding: 24 }}>
      <div>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: decision === 'approved' ? 'var(--brand-light)' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          {decision === 'approved' ? <CheckCircle size={36} color="var(--brand)" /> : <RefreshCw size={36} color="#ef4444" />}
        </div>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>
          {decision === 'approved' && 'Conteúdo aprovado!'}
          {decision === 'rejected' && 'Conteúdo recusado.'}
          {decision === 'revision' && 'Revisão solicitada.'}
        </h2>
        <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Sua resposta foi registrada. A agência foi notificada.</p>
      </div>
    </div>
  )

  const alreadyDecided = ['approved', 'rejected'].includes(deliverable.status)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)', padding: '32px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, background: 'var(--brand)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={20} color="#fff" />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--brand)' }}>AprovaAí</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Aprovação de conteúdo</p>
          </div>
        </div>

        {/* Content card */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>Solicitado por {client?.name}</p>
            <h2 style={{ fontSize: 22 }}>{deliverable.title}</h2>
            {deliverable.description && <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>{deliverable.description}</p>}
          </div>

          {/* File preview */}
          {deliverable.file_url && (
            <div style={{ padding: 24, background: 'var(--surface-3)' }}>
              {deliverable.file_type?.startsWith('image') ? (
                <img src={deliverable.file_url} alt="preview" style={{ maxWidth: '100%', borderRadius: 10, display: 'block' }} />
              ) : deliverable.file_type?.startsWith('video') ? (
                <video src={deliverable.file_url} controls style={{ maxWidth: '100%', borderRadius: 10 }} />
              ) : (
                <a href={deliverable.file_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand)', fontWeight: 500, fontSize: 14 }}>
                  <ExternalLink size={16} /> Abrir arquivo
                </a>
              )}
            </div>
          )}
        </div>

        {/* Decision */}
        {alreadyDecided ? (
          <div style={{ textAlign: 'center', padding: 24, background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
              Este conteúdo já foi <strong>{deliverable.status === 'approved' ? 'aprovado' : 'recusado'}</strong>.
            </p>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', padding: 28 }}>
            <h3 style={{ fontSize: 17, marginBottom: 20 }}>Qual é a sua decisão?</h3>

            {approvers.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <label>Quem está aprovando?</label>
                <select value={selectedApprover} onChange={e => setSelectedApprover(e.target.value)}>
                  <option value="">— Selecione —</option>
                  {approvers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            )}

            {/* Decision buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { value: 'approved', icon: CheckCircle, label: 'Aprovar', color: 'var(--brand)', lightColor: '#d1fae5' },
                { value: 'revision', icon: RefreshCw, label: 'Solicitar ajuste', color: '#8b5cf6', lightColor: '#ede9fe' },
                { value: 'rejected', icon: XCircle, label: 'Recusar', color: 'var(--danger)', lightColor: '#fee2e2' },
              ].map(({ value, icon: Icon, label, color, lightColor }) => (
                <button
                  key={value}
                  onClick={() => setDecision(v => v === value ? null : value)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '16px 8px', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                    border: `2px solid ${decision === value ? color : 'var(--border)'}`,
                    background: decision === value ? lightColor : 'var(--surface-3)',
                    color: decision === value ? color : 'var(--text-2)',
                    transition: 'all .15s',
                  }}
                >
                  <Icon size={22} />
                  {label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Comentário {decision === 'revision' ? '(obrigatório)' : '(opcional)'}</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                placeholder="Descreva sua decisão ou pontos a ajustar..."
                required={decision === 'revision'}
              />
            </div>

            <Button
              onClick={submit}
              loading={submitting}
              disabled={!decision || (decision === 'revision' && !comment)}
              style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16 }}
            >
              Confirmar resposta
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
