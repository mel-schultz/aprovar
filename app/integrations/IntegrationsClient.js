'use client'

import { ExternalLink, Plug } from 'lucide-react'
import { Card, Button } from '../../components/ui'

const INTEGRATIONS = [
  { id: 'gdrive',     name: 'Google Drive',      description: 'Importe arquivos diretamente do Drive para enviar à aprovação.', color: '#4285f4', action: 'Conectar' },
  { id: 'canva',      name: 'Canva',             description: 'Conecte sua conta Canva para usar designs na plataforma.',       color: '#7d2ae8', action: 'Conectar' },
  { id: 'zapier',     name: 'Zapier',            description: 'Automatize fluxos e conecte o Aprovar a centenas de ferramentas.', color: '#ff4a00', action: 'Ver docs' },
  { id: 'whatsapp',   name: 'WhatsApp (Meta API)', description: 'Envie notificações de aprovação via WhatsApp aos seus clientes.', color: '#25d366', action: 'Configurar' },
  { id: 'instagram',  name: 'Instagram',         description: 'Publique posts automaticamente via Facebook Graph API.',         color: '#e1306c', action: 'Em breve', disabled: true },
  { id: 'facebook',   name: 'Facebook',          description: 'Agende e publique em páginas do Facebook automaticamente.',      color: '#1877f2', action: 'Em breve', disabled: true },
  { id: 'youtube',    name: 'YouTube',           description: 'Faça upload de vídeos aprovados diretamente para o YouTube.',    color: '#ff0000', action: 'Em breve', disabled: true },
]

export default function IntegrationsClient() {
  const tools    = INTEGRATIONS.filter(i => !['instagram','facebook','youtube'].includes(i.id))
  const networks = INTEGRATIONS.filter(i =>  ['instagram','facebook','youtube'].includes(i.id))

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 4 }}>Integrações</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Conecte suas ferramentas favoritas ao Aprovar.</p>
      </div>

      <h2 style={{ fontSize: 15, marginBottom: 14, color: 'var(--text-2)' }}>Ferramentas e automação</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14, marginBottom: 32 }}>
        {tools.map(i => (
          <Card key={i.id} style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: i.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plug size={20} color={i.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{i.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 14 }}>{i.description}</p>
                <Button size="sm" variant={i.disabled ? 'secondary' : 'outline'} disabled={i.disabled}>
                  <ExternalLink size={13} /> {i.action}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 style={{ fontSize: 15, marginBottom: 14, color: 'var(--text-2)' }}>Redes sociais</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {networks.map(i => (
          <Card key={i.id} style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: i.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plug size={20} color={i.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{i.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 14 }}>{i.description}</p>
                <Button size="sm" variant="secondary" disabled>Em breve</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
