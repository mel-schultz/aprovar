import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Obter configurações de notificação
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json({
        error: 'clientId é obrigatório'
      }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o usuário tem acesso a este cliente
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, profile_id')
      .eq('id', clientId)
      .single()

    if (clientError || !client || client.profile_id !== user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Obter configurações
    const { data: settings, error } = await supabase
      .from('client_notification_settings')
      .select('*')
      .eq('client_id', clientId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error
    }

    // Se não existir, retornar configurações padrão
    const defaultSettings = {
      client_id: clientId,
      whatsapp_enabled: true,
      whatsapp_phone: client.whatsapp || '',
      notify_on_pending: true,
      notify_on_approved: false,
      notify_on_rejected: true,
    }

    return NextResponse.json({
      data: settings || defaultSettings
    })

  } catch (error) {
    console.error('Erro ao obter configurações:', error)
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}

// POST - Salvar configurações de notificação
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      clientId,
      whatsapp_enabled,
      whatsapp_phone,
      notify_on_pending,
      notify_on_approved,
      notify_on_rejected
    } = body

    if (!clientId || !whatsapp_phone) {
      return NextResponse.json({
        error: 'clientId e whatsapp_phone são obrigatórios'
      }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o usuário tem acesso a este cliente
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, profile_id')
      .eq('id', clientId)
      .single()

    if (clientError || !client || client.profile_id !== user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Validar formato de telefone (básico)
    const cleanPhone = whatsapp_phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      return NextResponse.json({
        error: 'Número de telefone inválido'
      }, { status: 400 })
    }

    // Salvar configurações
    const { data: settings, error } = await supabase
      .from('client_notification_settings')
      .upsert({
        client_id: clientId,
        whatsapp_enabled: whatsapp_enabled ?? true,
        whatsapp_phone: whatsapp_phone.trim(),
        notify_on_pending: notify_on_pending ?? true,
        notify_on_approved: notify_on_approved ?? false,
        notify_on_rejected: notify_on_rejected ?? true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Enviar mensagem de teste
    if (whatsapp_enabled) {
      await fetch('/api/notifications/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: whatsapp_phone,
          message: '✅ Configuração de notificações WhatsApp ativada com sucesso!\n\nVocê receberá mensagens quando tiver entregáveis para aprovação.\n\n_Mensagem automática do Aprovar_',
          type: 'confirmation',
          details: { clientId, clientName: client.name }
        })
      }).catch(err => console.error('Erro ao enviar msg de teste:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso',
      data: settings
    })

  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}
