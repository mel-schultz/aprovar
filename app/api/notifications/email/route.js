import { createClient } from '../../../lib/supabase/server'
import { createAdminClient } from '../../../lib/supabase/admin'
import { NextResponse } from 'next/server'

async function requireAdmin(supabase) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', session.user.id).single()
  return profile?.role === 'admin' ? session : null
}

// Template de e-mail de boas-vindas
function getWelcomeEmailTemplate(userName, email, password, loginUrl) {
  return {
    subject: '🎉 Bem-vindo ao Sistema!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Bem-vindo! 👋</h1>
        
        <p>Olá <strong>${userName}</strong>,</p>
        
        <p>Sua conta foi criada com sucesso. Aqui estão seus dados de acesso:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Senha Temporária:</strong> ${password}</p>
        </div>
        
        <p style="color: #ef4444;">
          ⚠️ <strong>Importante:</strong> Altere sua senha na primeira vez que fizer login.
        </p>
        
        <a href="${loginUrl}" style="
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          margin: 20px 0;
        ">
          Acessar Sistema
        </a>
        
        <p style="color: #6b7280; font-size: 12px;">
          Se não conseguir fazer login, tente copiar e colar este link:<br>
          ${loginUrl}
        </p>
      </div>
    `
  }
}

// Template de e-mail de password reset
function getPasswordResetEmailTemplate(userName, resetUrl) {
  return {
    subject: '🔑 Recuperação de Senha',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Recuperação de Senha</h1>
        
        <p>Olá <strong>${userName}</strong>,</p>
        
        <p>Você solicitou para resetar sua senha. Clique no link abaixo para criar uma nova senha:</p>
        
        <a href="${resetUrl}" style="
          display: inline-block;
          background: #ef4444;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          margin: 20px 0;
        ">
          Resetar Senha
        </a>
        
        <p style="color: #6b7280; font-size: 12px;">
          Este link expira em 1 hora.
        </p>
        
        <p style="color: #6b7280; font-size: 12px;">
          Se você não solicitou esta ação, ignore este e-mail.
        </p>
      </div>
    `
  }
}

// Template de notificação de alteração
function getChangeNotificationTemplate(userName, changeType, details) {
  return {
    subject: `✏️ Sua conta foi atualizada`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Notificação de Alteração</h1>
        
        <p>Olá <strong>${userName}</strong>,</p>
        
        <p>Sua conta foi atualizada:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tipo de Alteração:</strong> ${changeType}</p>
          <p><strong>Detalhes:</strong> ${details}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 12px;">
          Se você não fez esta alteração, entre em contato com o suporte imediatamente.
        </p>
      </div>
    `
  }
}

// POST /api/notifications/email - Enviar notificação de email
export async function POST(request) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const body = await request.json()
  const { email, type, userName, password, resetUrl, changeType, details, loginUrl } = body

  if (!email || !type) {
    return NextResponse.json({ error: 'E-mail e tipo de notificação obrigatórios' }, { status: 400 })
  }

  let emailContent
  switch (type) {
    case 'welcome':
      emailContent = getWelcomeEmailTemplate(userName, email, password, loginUrl || 'https://seu-sistema.com/login')
      break
    case 'password_reset':
      emailContent = getPasswordResetEmailTemplate(userName, resetUrl)
      break
    case 'change_notification':
      emailContent = getChangeNotificationTemplate(userName, changeType, details)
      break
    default:
      return NextResponse.json({ error: 'Tipo de notificação inválido' }, { status: 400 })
  }

  // Criar registro de notificação (em produção, integrar com serviço de email)
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('email_logs')
    .insert({
      recipient_email: email,
      type,
      subject: emailContent.subject,
      body: emailContent.html,
      status: 'queued',
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log de auditoria
  await admin.from('audit_logs').insert({
    action: 'send_email',
    admin_user_id: session.user.id,
    details: { email, type },
    created_at: new Date().toISOString(),
  })

  return NextResponse.json({
    data,
    message: 'E-mail enfileirado para envio',
    note: 'Em produção, integre com Resend, SendGrid ou similar'
  }, { status: 201 })
}

// GET /api/notifications/email - Listar histórico de e-mails
export async function GET(request) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)

  let query = supabase
    .from('email_logs')
    .select('*')

  if (type) query = query.eq('type', type)

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count: data?.length || 0 })
}
