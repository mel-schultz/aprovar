'use client'

import { useState, useEffect } from 'react'
import { Bell, MessageCircle, Check, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NotificationSettingsModal({ clientId, clientName, onClose }) {
  const [settings, setSettings] = useState({
    whatsapp_enabled: true,
    whatsapp_phone: '',
    notify_on_pending: true,
    notify_on_approved: false,
    notify_on_rejected: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [clientId])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/notifications/settings?clientId=${clientId}`)
      const data = await res.json()
      
      if (res.ok && data.data) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validação
      if (!settings.whatsapp_phone.trim()) {
        toast.error('Número de WhatsApp é obrigatório')
        return
      }

      const res = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          ...settings
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Configurações salvas com sucesso!')
        onClose?.()
      } else {
        toast.error(data.error || 'Erro ao salvar')
      }
    } catch (error) {
      toast.error('Erro ao salvar configurações')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#e8f5e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageCircle size={20} color="#4caf50" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Notificações WhatsApp</h2>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{clientName}</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Loader2 size={32} style={{ margin: '0 auto', color: '#3b82f6' }} />
            <p style={{ color: '#666', marginTop: '12px' }}>Carregando...</p>
          </div>
        ) : (
          <div>
            {/* Ativar/Desativar */}
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.whatsapp_enabled}
                  onChange={(e) => setSettings({ ...settings, whatsapp_enabled: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '600', fontSize: '14px' }}>
                  {settings.whatsapp_enabled ? '✅ Notificações ativadas' : '❌ Notificações desativadas'}
                </span>
              </label>
            </div>

            {/* Número de WhatsApp */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                Número de WhatsApp *
              </label>
              <input
                type="tel"
                value={settings.whatsapp_phone || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_phone: e.target.value })}
                placeholder="+55 11 99999-9999"
                disabled={!settings.whatsapp_enabled}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  opacity: settings.whatsapp_enabled ? 1 : 0.5
                }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Inclua o código do país (ex: +55 para Brasil)
              </p>
            </div>

            {/* Tipos de notificações */}
            {settings.whatsapp_enabled && (
              <>
                <div style={{ marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', color: '#666' }}>
                    Notificar quando:
                  </p>

                  {/* Novo entregável */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.notify_on_pending}
                      onChange={(e) => setSettings({ ...settings, notify_on_pending: e.target.checked })}
                    />
                    <span style={{ fontSize: '14px' }}>
                      📋 Um novo entregável chega para aprovação
                    </span>
                  </label>

                  {/* Aprovado */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.notify_on_approved}
                      onChange={(e) => setSettings({ ...settings, notify_on_approved: e.target.checked })}
                    />
                    <span style={{ fontSize: '14px' }}>
                      ✅ Um entregável é aprovado
                    </span>
                  </label>

                  {/* Rejeitado */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.notify_on_rejected}
                      onChange={(e) => setSettings({ ...settings, notify_on_rejected: e.target.checked })}
                    />
                    <span style={{ fontSize: '14px' }}>
                      ❌ Um entregável é rejeitado
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Aviso de teste */}
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fbbf24',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                💡 Uma mensagem de teste será enviada após salvar as configurações.
              </p>
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                disabled={saving}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: saving ? 0.6 : 1
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !settings.whatsapp_enabled}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: saving ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {saving && <Loader2 size={16} />}
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
