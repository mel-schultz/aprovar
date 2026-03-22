import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * API para enviar notificações via WhatsApp
 * 
 * Suporta:
 * 1. Twilio (mais robusto)
 * 2. Evolution API (mais simples, self-hosted)
 * 3. Generic Webhook (para serviços customizados)
 */

const WHATSAPP_SERVICE = process.env.WHATSAPP_SERVICE || 'twilio' // 'twilio' | 'evolution' | 'webhook'

// ============================================================
// TWILIO INTEGRATION
// ============================================================
async function sendViatwilio(phoneNumber, message) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Credenciais Twilio não configuradas')
    }

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: `whatsapp:${fromNumber}`,
          To: `whatsapp:${phoneNumber}`,
          Body: message,
        }).toString(),
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao enviar SMS via Twilio')
    }

    return { success: true, sid: data.sid }
  } catch (error) {
    console.error('Erro ao enviar via Twilio:', error)
    throw error
  }
}

// ============================================================
// EVOLUTION API INTEGRATION
// ============================================================
async function sendViaEvolution(phoneNumber, message) {
  try {
    const evolutionUrl = process.env.EVOLUTION_API_URL
    const evolutionApiKey = process.env.EVOLUTION_API_KEY
    const evolutionInstance = process.env.EVOLUTION_INSTANCE_NAME || 'aprovar'

    if (!evolutionUrl || !evolutionApiKey) {
      throw new Error('Credenciais Evolution API não configuradas')
    }

    // Remove caracteres especiais do número
    const cleanPhone = phoneNumber.replace(/\D/g, '')

    const response = await fetch(`${evolutionUrl}/message/sendText/${evolutionInstance}`, {
      method: 'POST',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: cleanPhone,
        text: message,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao enviar mensagem via Evolution API')
    }

    return { success: true, messageId: data.key?.id }
  } catch (error) {
    console.error('Erro ao enviar via Evolution API:', error)
    throw error
  }
}

// ============================================================
// GENERIC WEBHOOK
// ============================================================
async function sendViaWebhook(phoneNumber, message, details) {
  try {
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL

    if (!webhookUrl) {
      throw new Error('Webhook URL não configurada')
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.WHATSAPP_WEBHOOK_KEY || '',
      },
      body: JSON.stringify({
        phoneNumber,
        message,
        details,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error('Erro ao enviar via webhook')
    }

    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar via webhook:', error)
    throw error
  }
}

// ============================================================
// MAIN FUNCTION
// ============================================================
export async function POST(request) {
  try {
    const body = await request.json()
    const { phoneNumber, message, type, details } = body

    // Validações
    if (!phoneNumber || !message) {
      return NextResponse.json({
        error: 'phoneNumber e message são obrigatórios'
      }, { status: 400 })
    }

    // Validar formato de telefone (básico)
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      return NextResponse.json({
        error: 'Número de telefone inválido'
      }, { status: 400 })
    }

    let result

    // Enviar via serviço configurado
    if (WHATSAPP_SERVICE === 'twilio') {
      result = await sendViatwilio(phoneNumber, message)
    } else if (WHATSAPP_SERVICE === 'evolution') {
      result = await sendViaEvolution(phoneNumber, message)
    } else if (WHATSAPP_SERVICE === 'webhook') {
      result = await sendViaWebhook(phoneNumber, message, details)
    } else {
      return NextResponse.json({
        error: 'Serviço WhatsApp não configurado'
      }, { status: 400 })
    }

    // Log da notificação
    const supabase = createClient()
    await supabase.from('whatsapp_logs').insert({
      phone_number: phoneNumber,
      message: message,
      type: type || 'notification',
      service: WHATSAPP_SERVICE,
      status: 'sent',
      details: details || {},
      created_at: new Date().toISOString(),
    }).catch(err => console.error('Erro ao registrar log:', err))

    return NextResponse.json({
      success: true,
      message: 'Notificação enviada com sucesso',
      result
    })

  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
    
    return NextResponse.json({
      error: error.message || 'Erro ao enviar notificação'
    }, { status: 500 })
  }
}

// ============================================================
// GET - Listar histórico de notificações
// ============================================================
export async function GET(request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const phoneNumber = searchParams.get('phone')
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500)

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

    return NextResponse.json({
      data,
      count: data?.length || 0
    })

  } catch (error) {
    console.error('Erro ao listar logs:', error)
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}
