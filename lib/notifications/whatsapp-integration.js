/**
 * EXEMPLO DE INTEGRAÇÃO
 * 
 * Como adicionar notificação WhatsApp ao criar um entregável
 * 
 * Adicione este código no seu componente/página de aprovações
 * (provavelmente app/approvals/ApprovalsClient.js)
 */

import { sendWhatsAppNotification } from '@/lib/notifications/whatsapp'

/**
 * Função auxiliar para enviar notificação ao criar entregável
 */
export async function notifyOnDeliverableCreated({
  supabase,
  deliverable,
  client,
  approvers = []
}) {
  try {
    // Verificar se cliente tem notificações ativadas
    const { data: settings } = await supabase
      .from('client_notification_settings')
      .select('*')
      .eq('client_id', client.id)
      .single()

    // Se não está ativado, não faz nada
    if (!settings?.whatsapp_enabled || !settings?.notify_on_pending) {
      console.log('Notificações desativadas para este cliente')
      return
    }

    if (!settings.whatsapp_phone) {
      console.warn('Cliente não tem número de WhatsApp configurado')
      return
    }

    // Montar link de aprovação
    const approvalLink = `${process.env.NEXT_PUBLIC_APP_URL}/approvals?deliverable=${deliverable.id}`

    // Enviar notificação
    const result = await sendWhatsAppNotification({
      phoneNumber: settings.whatsapp_phone,
      clientName: client.name,
      deliverableTitle: deliverable.title,
      approvalLink,
      type: 'created',
      details: {
        clientId: client.id,
        deliverableId: deliverable.id,
        approverCount: approvers.length
      }
    })

    if (result.success) {
      console.log('Notificação enviada com sucesso')

      // Registrar que notificação foi enviada
      await supabase
        .from('deliverable_notifications')
        .insert({
          deliverable_id: deliverable.id,
          client_id: client.id,
          notification_type: 'created',
          sent_at: new Date().toISOString()
        })
        .catch(err => console.error('Erro ao registrar notificação:', err))
    } else {
      console.error('Erro ao enviar notificação:', result.error)
    }

    return result

  } catch (error) {
    console.error('Erro ao processar notificação:', error)
    // Não lançar erro para não quebrar fluxo de criação do entregável
    return { success: false, error: error.message }
  }
}

/**
 * EXEMPLO: Como usar no componente ApprovalsClient
 * 
 * Adicione isto no método que cria entregável:
 */

// ============================================================
// EXEMPLO COMPLETO - Adicione ao seu ApprovalsClient.js
// ============================================================

/*
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { notifyOnDeliverableCreated } from '@/lib/notifications/whatsapp-integration'

export default function ApprovalsClient({ clients }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleCreateDeliverable = async (formData) => {
    try {
      setLoading(true)

      // 1. Obter cliente
      const client = clients.find(c => c.id === formData.clientId)
      if (!client) {
        toast.error('Cliente não encontrado')
        return
      }

      // 2. Buscar aprovadores (opcional)
      const { data: approvers } = await supabase
        .from('approvers')
        .select('*')
        .eq('client_id', client.id)

      // 3. Criar entregável
      const { data: deliverable, error: createError } = await supabase
        .from('deliverables')
        .insert({
          title: formData.title,
          description: formData.description,
          client_id: client.id,
          profile_id: (await supabase.auth.getUser()).data.user.id,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) throw createError

      // 4. NOVO: Enviar notificação WhatsApp! 🎉
      await notifyOnDeliverableCreated({
        supabase,
        deliverable,
        client,
        approvers: approvers || []
      })

      toast.success('Entregável criado com sucesso!')
      // Atualizar lista, fechar modal, etc...

    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao criar entregável')
    } finally {
      setLoading(false)
    }
  }

  return (
    // ... seu JSX aqui ...
  )
}
*/

// ============================================================
// EXEMPLO: Notificação ao Aprovar
// ============================================================

export async function notifyOnDeliverableApproved({
  supabase,
  deliverable,
  client
}) {
  try {
    // Verificar se cliente quer notificação de aprovação
    const { data: settings } = await supabase
      .from('client_notification_settings')
      .select('*')
      .eq('client_id', client.id)
      .single()

    if (!settings?.whatsapp_enabled || !settings?.notify_on_approved) {
      return
    }

    const result = await sendWhatsAppNotification({
      phoneNumber: settings.whatsapp_phone,
      clientName: client.name,
      deliverableTitle: deliverable.title,
      type: 'approved'
    })

    if (result.success) {
      await supabase
        .from('deliverable_notifications')
        .insert({
          deliverable_id: deliverable.id,
          client_id: client.id,
          notification_type: 'approved',
          sent_at: new Date().toISOString()
        })
    }

    return result

  } catch (error) {
    console.error('Erro ao notificar aprovação:', error)
    return { success: false, error: error.message }
  }
}

// ============================================================
// EXEMPLO: Notificação ao Rejeitar
// ============================================================

export async function notifyOnDeliverableRejected({
  supabase,
  deliverable,
  client,
  reason = ''
}) {
  try {
    const { data: settings } = await supabase
      .from('client_notification_settings')
      .select('*')
      .eq('client_id', client.id)
      .single()

    if (!settings?.whatsapp_enabled || !settings?.notify_on_rejected) {
      return
    }

    let message = `❌ *Entregável Rejeitado*\n\n`
    message += `Seu entregável "${deliverable.title}" foi rejeitado.\n`
    if (reason) {
      message += `Motivo: ${reason}\n`
    }
    message += `Favor revisar e reenviar.\n\n`
    message += `_Mensagem automática do Aprovar_`

    const result = await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: settings.whatsapp_phone,
        message,
        type: 'rejected'
      })
    }).then(r => r.json())

    if (result.success) {
      await supabase
        .from('deliverable_notifications')
        .insert({
          deliverable_id: deliverable.id,
          client_id: client.id,
          notification_type: 'rejected',
          sent_at: new Date().toISOString()
        })
    }

    return result

  } catch (error) {
    console.error('Erro ao notificar rejeição:', error)
    return { success: false, error: error.message }
  }
}

// ============================================================
// EXEMPLO: Lembretes (executar periodicamente via Cron)
// ============================================================

export async function sendPendingNotificationReminders(supabase) {
  try {
    // Buscar entregáveis pendentes que não foram notificados
    const { data: pending } = await supabase
      .from('v_pending_notifications')
      .select('*')

    if (!pending || pending.length === 0) {
      console.log('Nenhum entregável pendente para lembrete')
      return
    }

    // Enviar lembrete para cada um
    const results = await Promise.all(
      pending.map(item =>
        sendWhatsAppNotification({
          phoneNumber: item.client_whatsapp || item.whatsapp_phone,
          clientName: item.client_name,
          deliverableTitle: item.title,
          approvalLink: `${process.env.NEXT_PUBLIC_APP_URL}/approvals?deliverable=${item.deliverable_id}`,
          type: 'reminder'
        })
      )
    )

    const sent = results.filter(r => r.success).length
    console.log(`${sent}/${pending.length} lembretes enviados`)

    return results

  } catch (error) {
    console.error('Erro ao enviar lembretes:', error)
    return []
  }
}

// ============================================================
// PASSOS PARA INTEGRAR
// ============================================================

/*
1. Copie a função notifyOnDeliverableCreated para seu projeto
2. No componente que cria entregável, importe-a
3. Após criar o entregável, chame:

   await notifyOnDeliverableCreated({
     supabase,
     deliverable,
     client,
     approvers
   })

4. Pronto! Notificações via WhatsApp funcionando 🎉

EXEMPLO MÍNIMO:

import { notifyOnDeliverableCreated } from '@/lib/notifications/whatsapp-integration'

// ... dentro do handleCreateDeliverable ...

const { data: deliverable } = await supabase
  .from('deliverables')
  .insert({ ... })
  .select()
  .single()

// Enviar notificação!
await notifyOnDeliverableCreated({
  supabase,
  deliverable,
  client,
  approvers: []
})
*/
