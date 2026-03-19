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

// GET /api/users — lista todos os usuários (admin only)
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

// POST /api/users — cria usuário no Supabase Auth + perfil (admin only)
export async function POST(request) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const body = await request.json()
  const { email, password, full_name, role, phone, company, linked_client_id } = body

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'E-mail, senha e papel são obrigatórios' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Cria o usuário no Auth
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, company },
  })

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

  // Upsert do perfil com os campos extras
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .upsert({
      id: authData.user.id,
      full_name: full_name || null,
      email,
      phone:            phone            || null,
      company:          company          || null,
      role,
      linked_client_id: linked_client_id || null,
      created_by:       session.user.id,
    })
    .select()
    .single()

  if (profileError) {
    // Rollback: remove o auth user se o perfil falhou
    await admin.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ data: profile }, { status: 201 })
}
