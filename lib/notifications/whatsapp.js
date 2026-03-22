/**
 * Utility function para enviar notificações via WhatsApp
 * 
 * Uso:
 * import { sendWhatsAppNotification } from '@/lib/notifications/whatsapp'
 * 
 * await sendWhatsAppNotification({
 *   phoneNumber: '+5511999999999',
 *   clientName: 'Nome da Empresa',
 *   deliverableTitle: 'Título do Entregável',
 *   approvalLink: 'https://...'
 * })
 */

export async function sendWhatsAppNotification({
  phoneNumber,
  clientName,
  deliverableTitle,
  approvalLink,
  type = 'created', // 'created', 'approved', 'rejected', 'reminder'
  details = {}
}) {
  try {
    // Validações
    if (!phoneNumber) {
      console.error('phoneNumber é obrigatório')
      return { success: false, error: 'phoneNumber é obrigatório' }
    }

    if (!clientName || !deliverableTitle) {
      console.error('clientName e deliverableTitle são obrigatórios')
      return { success: false, error: 'Dados incompletos' }
    }

    // Formatar mensagem baseado no tipo
    let message = ''
    
    if (type === 'created') {
      message = `📋 *Novo Entregável para Aprovação*\n\n`
      message += `Cliente: ${clientName}\n`
      message += `Título: ${deliverableTitle}\n`
      message += `\nClique no link abaixo para aprovar:\n`
      message += `${approvalLink}\n\n`
      message += `_Mensagem automática do Aprovar_`
    } else if (type === 'approved') {
      message = `✅ *Entregável Aprovado*\n\n`
      message += `Seu entregável "${deliverableTitle}" foi aprovado!\n\n`
      message += `_Mensagem automática do Aprovar_`
    } else if (type === 'rejected') {
      message = `❌ *Entregável Rejeitado*\n\n`
      message += `Seu entregável "${deliverableTitle}" foi rejeitado.\n`
      message += `Favor revisar e reenviar.\n\n`
      message += `_Mensagem automática do Aprovar_`
    } else if (type === 'reminder') {
      message = `⏰ *Lembrete: Entregável Pendente*\n\n`
      message += `Cliente: ${clientName}\n`
      message += `Título: ${deliverableTitle}\n`
      message += `\nAinda há entregáveis aguardando aprovação.\n`
      message += `Clique para revisar: ${approvalLink}\n\n`
      message += `_Mensagem automática do Aprovar_`
    }

    // Enviar via API
    const response = await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        message,
        type,
        details: {
          clientName,
          deliverableTitle,
          approvalLink,
          ...details
        }
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Erro ao enviar notificação:', result)
      return { success: false, error: result.error }
    }

    console.log('Notificação WhatsApp enviada:', result)
    return { success: true, data: result }

  } catch (error) {
    console.error('Erro ao enviar notificação WhatsApp:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Enviar notificação para todos os aprovadores de um cliente
 */
export async function sendNotificationToApprovers({
  clientId,
  clientName,
  deliverableTitle,
  deliverableId,
  approvers = []
}) {
  try {
    if (!clientId || !clientName || !deliverableTitle) {
      return { success: false, error: 'Dados incompletos' }
    }

    // URL de aprovação
    const approvalLink = `${process.env.NEXT_PUBLIC_APP_URL}/approvals?deliverable=${deliverableId}`

    // Enviar para cada aprovador
    const results = await Promise.all(
      approvers.map(approver =>
        sendWhatsAppNotification({
          phoneNumber: approver.phone_number,
          clientName,
          deliverableTitle,
          approvalLink,
          type: 'created',
          details: {
            approverId: approver.id,
            approverName: approver.name
          }
        })
      )
    )

    const successCount = results.filter(r => r.success).length
    const failedCount = results.filter(r => !r.success).length

    return {
      success: failedCount === 0,
      successCount,
      failedCount,
      results
    }

  } catch (error) {
    console.error('Erro ao enviar notificações:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Registrar notificação como enviada
 */
export async function registerNotification(supabase, {
  deliverableId,
  clientId,
  notificationType,
  whatsappLogId
}) {
  try {
    const { data, error } = await supabase
      .from('deliverable_notifications')
      .insert({
        deliverable_id: deliverableId,
        client_id: clientId,
        notification_type: notificationType,
        whatsapp_log_id: whatsappLogId,
        sent_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }

  } catch (error) {
    console.error('Erro ao registrar notificação:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Obter configurações de notificação de um cliente
 */
export async function getClientNotificationSettings(supabase, clientId) {
  try {
    const { data, error } = await supabase
      .from('client_notification_settings')
      .select('*')
      .eq('client_id', clientId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error
    }

    // Se não existir, retornar configurações padrão
    if (!data) {
      return {
        whatsapp_enabled: true,
        notify_on_pending: true,
        notify_on_approved: false,
        notify_on_rejected: true
      }
    }

    return data

  } catch (error) {
    console.error('Erro ao obter configurações de notificação:', error)
    return null
  }
}

/**
 * Atualizar configurações de notificação
 */
export async function updateNotificationSettings(supabase, clientId, settings) {
  try {
    const { data, error } = await supabase
      .from('client_notification_settings')
      .upsert({
        client_id: clientId,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }

  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Obter histórico de notificações
 */
export async function getNotificationHistory(supabase, { phoneNumber, limit = 50 }) {
  try {
    let query = supabase
      .from('whatsapp_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (phoneNumber) {
      query = query.eq('phone_number', phoneNumber)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }

  } catch (error) {
    console.error('Erro ao obter histórico:', error)
    return { success: false, error: error.message }
  }
}
