import { ExternalLink, CheckCircle, Plug } from 'lucide-react'
import { Card, Button } from '../components/ui'

const integrations = [
  {
    id: 'gdrive',
    name: 'Google Drive',
    description: 'Importe arquivos e conteúdos diretamente do seu Drive para enviar à aprovação.',
    color: '#4285f4',
    authUrl: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/drive.readonly&access_type=offline&response_type=code&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/oauth/gdrive`,
    connected: false,
  },
  {
    id: 'canva',
    name: 'Canva',
    description: 'Conecte sua conta Canva para usar designs diretamente na plataforma.',
    color: '#7d2ae8',
    authUrl: 'https://www.canva.com/api/oauth/authorize',
    connected: false,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automatize fluxos de trabalho e conecte o AprovaAí a centenas de ferramentas.',
    color: '#ff4a00',
    docsUrl: 'https://zapier.com',
    connected: false,
    webhook: true,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp (Meta API)',
    description: 'Envie notificações de aprovação diretamente via WhatsApp para seus clientes.',
    color: '#25d366',
    connected: false,
    configRequired: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Publique posts automaticamente após aprovação via Facebook Graph API.',
    color: '#e1306c',
    connected: false,
    network: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Agende e publique em páginas do Facebook automaticamente.',
    color: '#1877f2',
    connected: false,
    network: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Faça upload de vídeos aprovados diretamente para o YouTube.',
    color: '#ff0000',
    connected: false,
    network: true,
  },
]

function IntegrationCard({ integration }) {
  const { name, description, color, connected, configRequired, authUrl, docsUrl } = integration

  return (
    <Card style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Plug size={20} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>{name}</h3>
            {connected && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--brand)', fontWeight: 500 }}>
                <CheckCircle size={12} /> Conectado
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 14 }}>{description}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {authUrl && (
              <Button size="sm" variant={connected ? 'secondary' : 'outline'} onClick={() => window.open(authUrl, '_blank')}>
                <ExternalLink size={13} /> {connected ? 'Reconectar' : 'Conectar'}
              </Button>
            )}
            {docsUrl && (
              <Button size="sm" variant="secondary" onClick={() => window.open(docsUrl, '_blank')}>
                <ExternalLink size={13} /> Ver docs
              </Button>
            )}
            {configRequired && (
              <Button size="sm" variant="outline">Configurar</Button>
            )}
            {!authUrl && !docsUrl && !configRequired && (
              <Button size="sm" variant="outline">Em breve</Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function IntegrationsPage() {
  const networks = integrations.filter(i => i.network)
  const tools = integrations.filter(i => !i.network)

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26 }}>Integrações</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>Conecte suas ferramentas favoritas ao AprovaAí.</p>
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 14, color: 'var(--text-2)' }}>Ferramentas e automação</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14, marginBottom: 32 }}>
        {tools.map(i => <IntegrationCard key={i.id} integration={i} />)}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 14, color: 'var(--text-2)' }}>Redes sociais</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {networks.map(i => <IntegrationCard key={i.id} integration={i} />)}
      </div>
    </div>
  )
}
