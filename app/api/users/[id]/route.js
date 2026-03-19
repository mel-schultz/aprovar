import { createClient } from '../../../../lib/supabase/server'
import { createAdminClient } from '../../../../lib/supabase/admin'
import { NextResponse } from 'next/server'

async function requireAdmin(supabase) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', session.user.id).single()
  return profile?.role === 'admin' ? session : null
}

// GET /api/users/[id]
export async function GET(request, { params }) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { data, error } = await supabase
    .from('users_with_clients')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

// PATCH /api/users/[id] — atualiza perfil e opcionalmente senha/email
export async function PATCH(request, { params }) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const body = await request.json()
  const { email, password, full_name, role, phone, company, linked_client_id, is_active } = body

  const admin = createAdminClient()

  // Atualiza no Auth (email e/ou senha se fornecidos)
  const authUpdates = {}
  if (email)    authUpdates.email    = email
  if (password) authUpdates.password = password
  if (Object.keys(authUpdates).length > 0) {
    const { error: authError } = await admin.auth.admin.updateUserById(params.id, authUpdates)
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Atualiza o perfil
  const profileUpdates = {}
  if (full_name          !== undefined) profileUpdates.full_name          = full_name
  if (email              !== undefined) profileUpdates.email              = email
  if (phone              !== undefined) profileUpdates.phone              = phone
  if (company            !== undefined) profileUpdates.company            = company
  if (role               !== undefined) profileUpdates.role               = role
  if (linked_client_id   !== undefined) profileUpdates.linked_client_id   = linked_client_id || null
  if (is_active          !== undefined) profileUpdates.is_active          = is_active

  const { data, error } = await admin
    .from('profiles')
    .update(profileUpdates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// DELETE /api/users/[id] — remove do Auth e o perfil em cascade
export async function DELETE(request, { params }) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  // Impede auto-deleção
  if (params.id === session.user.id) {
    return NextResponse.json({ error: 'Você não pode excluir sua própria conta.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
