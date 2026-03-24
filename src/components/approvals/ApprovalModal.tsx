import { Approval } from '../../types'
import { X, Calendar, Globe, User, FileText } from 'lucide-react'

interface Props {
  approval: Approval
  onClose: () => void
  onSaved: () => void
}

const statusLabel: Record<string, string> = {
  draft: 'Rascunho', pending: 'Aguardando', approved: 'Aprovado',
  rejected: 'Rejeitado', published: 'Publicado',
}

export default function ApprovalModal({ approval, onClose }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{approval.title}</h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className={`status-badge status-${approval.status}`}>{statusLabel[approval.status]}</span>
            <span className={`platform-badge platform-${approval.platform}`}>{approval.platform}</span>
          </div>

          {approval.media_urls?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Mídias</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {approval.media_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #d0d7de' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14} /> Conteúdo
            </div>
            <div style={{ fontSize: 14, color: '#1f2328', background: '#f6f8fa', borderRadius: 6, padding: 12, whiteSpace: 'pre-wrap' }}>
              {approval.content}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#57606a' }}>
            {(approval as any).client?.name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} /> {(approval as any).client.name}
              </div>
            )}
            {approval.scheduled_date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} /> {new Date(approval.scheduled_date).toLocaleString('pt-BR')}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Globe size={14} /> {approval.platform}
            </div>
          </div>

          {approval.notes && (
            <div style={{ marginTop: 16, padding: 12, background: '#fff8c5', borderRadius: 6, fontSize: 13, color: '#7d4e00' }}>
              <strong>Obs:</strong> {approval.notes}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}
