import { useState } from 'react'
import { Plug, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface IntegrationDef {
  id: string
  name: string
  description: string
  icon: string
  color: string
  connectUrl?: string
}

const integrations: IntegrationDef[] = [
  {
    id: 'google_drive',
    name: 'Google Drive',
    description: 'Armazene e acesse mídias e arquivos diretamente do Google Drive.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
    color: '#fff8c5',
    connectUrl: 'https://drive.google.com',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sincronize pautas, calendários editoriais e documentos do Notion.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    color: '#f6f8fa',
    connectUrl: 'https://notion.so',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Receba notificações de aprovações e rejeições no Slack.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    color: '#fce4ec',
    connectUrl: 'https://slack.com',
  },
  {
    id: 'canva',
    name: 'Canva',
    description: 'Crie e importe designs diretamente do Canva.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
    color: '#ddf4ff',
    connectUrl: 'https://canva.com',
  },
  {
    id: 'meta',
    name: 'Meta Business Suite',
    description: 'Publique diretamente no Facebook e Instagram via Meta Business API.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    color: '#e3f2fd',
    connectUrl: 'https://business.facebook.com',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automatize fluxos de trabalho conectando o Approve com centenas de ferramentas.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg',
    color: '#fff3e0',
    connectUrl: 'https://zapier.com',
  },
]

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    const isConn = connected[id]
    setConnected(c => ({ ...c, [id]: !isConn }))
    toast.success(isConn ? 'Integração desconectada' : 'Integração conectada com sucesso!')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Integrações</h1>
        <p style={{ color: '#57606a', fontSize: 14, margin: 0 }}>Conecte o Approve com suas ferramentas favoritas.</p>
      </div>

      <div className="grid-cards">
        {integrations.map(integ => (
          <div key={integ.id} className="integration-card">
            <div style={{ width: 56, height: 56, background: integ.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
              <img src={integ.icon} alt={integ.name} style={{ width: 36, height: 36, objectFit: 'contain' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{integ.name}</div>
            <div style={{ fontSize: 13, color: '#57606a', textAlign: 'center' }}>{integ.description}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {connected[integ.id] ? (
                <CheckCircle size={14} color="#1a7f37" />
              ) : (
                <XCircle size={14} color="#8c959f" />
              )}
              <span style={{ fontSize: 12, color: connected[integ.id] ? '#1a7f37' : '#8c959f', fontWeight: 600 }}>
                {connected[integ.id] ? 'Conectado' : 'Não conectado'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={`btn btn-sm ${connected[integ.id] ? 'btn-secondary' : 'btn-primary'}`} onClick={() => toggle(integ.id)}>
                {connected[integ.id] ? 'Desconectar' : 'Conectar'}
              </button>
              {integ.connectUrl && (
                <a href={integ.connectUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: '#f6f8fa', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plug size={20} color="#57606a" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Precisa de outra integração?</div>
            <div style={{ fontSize: 13, color: '#57606a' }}>Entre em contato com o suporte para solicitar novas integrações.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
