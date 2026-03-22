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

// GET /api/audit-logs - Retorna logs de auditoria
export async function GET(request) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)
  const action = searchParams.get('action')
  const userId = searchParams.get('user_id')

  let query = supabase
    .from('audit_logs')
    .select('*')

  if (action) query = query.eq('action', action)
  if (userId) query = query.eq('target_user_id', userId)

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ data, count: data?.length || 0 })
}

// POST /api/audit-logs - Criar log de auditoria (interno)
export async function POST(request) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const body = await request.json()
  const { action, target_user_id, details } = body

  if (!action) {
    return NextResponse.json({ error: 'Ação obrigatória' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('audit_logs')
    .insert({
      action,
      admin_user_id: session.user.id,
      target_user_id: target_user_id || null,
      details: details || {},
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
