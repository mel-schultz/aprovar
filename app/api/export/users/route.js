import { createClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'

async function requireAdmin(supabase) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', session.user.id).single()
  return profile?.role === 'admin' ? session : null
}

// GET /api/export/users - Exporta usuários em formato solicitado
export async function GET(request) {
  const supabase = createClient()
  const session = await requireAdmin(supabase)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'json' // json, csv
  const role = searchParams.get('role')
  const status = searchParams.get('status')

  // Construir query
  let query = supabase
    .from('users_with_clients')
    .select('*')

  if (role) query = query.eq('role', role)
  if (status === 'active') query = query.eq('is_active', true)
  if (status === 'inactive') query = query.eq('is_active', false)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (format === 'csv') {
    return exportCSV(data)
  }

  return NextResponse.json({ data })
}

function exportCSV(data) {
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Nenhum dado para exportar' }, { status: 400 })
  }

  // Headers do CSV
  const headers = ['ID', 'Nome', 'E-mail', 'Nível', 'Status', 'Telefone', 'Empresa', 'Criado em']
  
  // Converter dados para CSV
  const rows = data.map(user => [
    user.id,
    user.full_name,
    user.email,
    translateRole(user.role),
    user.is_active ? 'Ativo' : 'Inativo',
    user.phone || '-',
    user.company || '-',
    new Date(user.created_at).toLocaleDateString('pt-BR'),
  ])

  // Criar CSV
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="usuarios-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}

function translateRole(role) {
  const roleMap = {
    'admin': 'Administrador',
    'atendimento': 'Atendimento',
    'cliente': 'Cliente',
  }
  return roleMap[role] || role
}
