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

const VALID_ROLES = ['admin', 'atendimento', 'cliente']

// Função para criar log de auditoria
async function logAudit(admin, adminId, action, targetUserId, details) {
  try {
    await admin.from('audit_logs').insert({
      action,
      admin_user_id: adminId,
      target_user_id: targetUserId || null,
      details: details || {},
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error)
  }
}

// Função para enviar notificação de email
async function sendEmailNotification(email, type, userData, details = {}) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}/api/notifications/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        type,
        userName: userData.full_name || email.split('@')[0],
        loginUrl: `${baseUrl}/login`,
        ...details,
      }),
    }).catch(() => {})
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
  }
}

// GET /api/users — Lista com filtros e estatísticas
export async function GET(request) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let query = supabase
    .from('users_with_clients')
    .select('*')

  if (role && VALID_ROLES.includes(role)) {
    query = query.eq('role', role)
  }

  if (status === 'active') {
    query = query.eq('is_active', true)
  } else if (status === 'inactive') {
    query = query.eq('is_active', false)
  }

  if (search && search.trim()) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  const stats = {
    total: data.length,
    admin: data.filter(u => u.role === 'admin').length,
    atendimento: data.filter(u => u.role === 'atendimento').length,
    cliente: data.filter(u => u.role === 'cliente').length,
    active: data.filter(u => u.is_active).length,
    inactive: data.filter(u => !u.is_active).length,
  }

  return NextResponse.json({ data, stats })
}

// POST /api/users — Criar novo usuário
export async function POST(request) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const body = await request.json()
  const { email, password, full_name, role, phone, company, linked_client_id } = body

  if (!email || !password || !role) {
    return NextResponse.json({ 
      error: 'E-mail, senha e nível de acesso são obrigatórios' 
    }, { status: 400 })
  }

  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ 
      error: `Nível inválido. Valores permitidos: ${VALID_ROLES.join(', ')}` 
    }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ 
      error: 'A senha deve ter pelo menos 6 caracteres' 
    }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, company, role },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .upsert({
      id: authData.user.id,
      full_name: full_name || authData.user.email.split('@')[0],
      email,
      phone: phone || null,
      company: company || null,
      role,
      linked_client_id: linked_client_id || null,
      is_active: true,
      created_by: session.user.id,
    })
    .select()
    .single()

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Log de auditoria
  await logAudit(admin, session.user.id, 'user_created', authData.user.id, {
    email,
    full_name,
    role,
  })

  // Enviar e-mail de boas-vindas
  await sendEmailNotification(email, 'welcome', profile, {
    password,
  })

  return NextResponse.json({ data: profile }, { status: 201 })
}
