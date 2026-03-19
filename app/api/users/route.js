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

// GET /api/users
export async function GET() {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { data, error } = await supabase
    .from('users_with_clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST /api/users — cria usuário Auth + perfil completo
export async function POST(request) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const body = await request.json()
  const { email, password, full_name, role, phone, company, linked_client_id } = body

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'E-mail, senha e nível de acesso são obrigatórios' }, { status: 400 })
  }

  const admin = createAdminClient()

  // 1. Cria o usuário no Supabase Auth com metadados de role
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,          // confirma o e-mail automaticamente
    user_metadata: { full_name, company, role },  // role passado ao trigger
  })

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

  // 2. Upsert do perfil com todos os campos
  //    O trigger já cria o perfil, mas o upsert garante phone, linked_client_id, etc.
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .upsert({
      id:               authData.user.id,
      full_name:        full_name || authData.user.email.split('@')[0],
      email:            email,
      phone:            phone            || null,
      company:          company          || null,
      role,
      linked_client_id: linked_client_id || null,
      is_active:        true,
      created_by:       session.user.id,
    })
    .select()
    .single()

  if (profileError) {
    // Rollback: remove o auth user se o upsert falhou
    await admin.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ data: profile }, { status: 201 })
}
