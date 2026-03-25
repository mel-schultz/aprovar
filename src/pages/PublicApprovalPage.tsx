import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Approval, Client } from '../types'
import { CheckCircle, XCircle, Clock, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PublicApprovalPage() {
  const { id } = useParams<{ id: string }>()
  const [approval, setApproval] = useState<(Approval & { client?: Client }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    async function fetchApproval() {
      if (!id) return
      setLoading(true)
      const { data, error } = await supabase
        .from('approvals')
        .select('*, client:clients(name, logo_url)')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching approval:', error)
        toast.error('Não foi possível carregar a aprovação.')
      } else {
        setApproval(data as any)
      }
      setLoading(false)
    }
    fetchApproval()
  }, [id])

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!approval || !id) return
    setActionLoading(true)
    const { error } = await supabase
      .from('approvals')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao processar ação.')
    } else {
      setApproval({ ...approval, status })
      toast.success(status === 'approved' ? 'Aprovação confirmada!' : 'Aprovação rejeitada.')
    }
    setActionLoading(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f6f8fa' }}>
        <div style={{ textAlign: 'center', color: '#57606a' }}>
          <Clock size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p>Carregando aprovação...</p>
        </div>
      </div>
    )
  }

  if (!approval) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f6f8fa' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 20 }}>
          <XCircle size={48} color="#cf222e" style={{ marginBottom: 16 }} />
          <h2>Aprovação não encontrada</h2>
          <p style={{ color: '#57606a' }}>O link pode estar expirado ou a aprovação foi removida.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {approval.client?.logo_url ? (
              <img src={approval.client.logo_url} alt={approval.client.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: 8, background: '#0969da', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {approval.client?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div>
              <h1 style={{ fontSize: 18, margin: 0 }}>{approval.client?.name || 'Aprovação de Conteúdo'}</h1>
              <p style={{ fontSize: 13, color: '#57606a', margin: 0 }}>Solicitação de aprovação</p>
            </div>
          </div>
          <div className={`status-badge status-${approval.status}`} style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            {approval.status === 'pending' ? 'Aguardando sua aprovação' : 
             approval.status === 'approved' ? 'Aprovado' : 
             approval.status === 'rejected' ? 'Rejeitado' : 
             approval.status === 'published' ? 'Publicado' : 'Rascunho'}
          </div>
        </div>

        {/* Content Card */}
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {approval.media_urls && approval.media_urls.length > 0 ? (
            <div style={{ background: '#000', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={approval.media_urls[0]} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain' }} 
              />
            </div>
          ) : (
            <div style={{ height: 200, background: '#f1f3f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>
              <ImageIcon size={48} />
              <p>Sem prévia de imagem</p>
            </div>
          )}

          <div style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, margin: 0 }}>{approval.title}</h2>
              <span style={{ background: '#f1f3f5', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                {approval.platform}
              </span>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', color: '#24292f', lineHeight: 1.6, fontSize: 16, marginBottom: 32, padding: 20, background: '#f8f9fa', borderRadius: 8, border: '1px solid #d0d7de' }}>
              {approval.content}
            </div>

            {approval.scheduled_date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#57606a', fontSize: 14, marginBottom: 32 }}>
                <Clock size={16} />
                <span>Agendado para: <strong>{new Date(approval.scheduled_date).toLocaleString('pt-BR')}</strong></span>
              </div>
            )}

            {/* Actions */}
            {approval.status === 'pending' && (
              <div style={{ display: 'flex', gap: 16 }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, height: 48, fontSize: 16, background: '#1a7f37', borderColor: '#1a7f37' }}
                  onClick={() => handleAction('approved')}
                  disabled={actionLoading}
                >
                  <CheckCircle size={20} style={{ marginRight: 8 }} />
                  {actionLoading ? 'Processando...' : 'Aprovar Conteúdo'}
                </button>
                <button 
                  className="btn" 
                  style={{ flex: 1, height: 48, fontSize: 16, color: '#cf222e', borderColor: '#d0d7de' }}
                  onClick={() => handleAction('rejected')}
                  disabled={actionLoading}
                >
                  <XCircle size={20} style={{ marginRight: 8 }} />
                  {actionLoading ? 'Processando...' : 'Solicitar Ajustes'}
                </button>
              </div>
            )}

            {approval.status !== 'pending' && (
              <div style={{ textAlign: 'center', padding: '20px', background: approval.status === 'approved' ? '#dafbe1' : '#ffebe9', borderRadius: 8, color: approval.status === 'approved' ? '#1a7f37' : '#cf222e', fontWeight: 600 }}>
                {approval.status === 'approved' ? 'Este conteúdo foi aprovado por você.' : 
                 approval.status === 'rejected' ? 'Este conteúdo foi rejeitado e aguarda ajustes.' : 
                 'Este conteúdo já foi processado.'}
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, color: '#8c959f', fontSize: 12 }}>
          <p>Plataforma de Aprovação de Conteúdo &copy; 2026</p>
        </div>
      </div>
    </div>
  )
}
