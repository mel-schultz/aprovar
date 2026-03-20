import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const SUPER_ADMIN = 'mel.schultz@yahoo.com'
const VALID_ROLES = ['super_admin', 'atendimento', 'cliente']

async function checkSuperAdmin(userId) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.email !== SUPER_ADMIN) {
    return false
  }
  return true
}

// GET /api/admin/usuarios - Listar todos os usuários
export async function GET(request) {
  try {
    const isSuperAdmin = await checkSuperAdmin()
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    let query = supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false })

    if (role) {
      query = query.eq('role', role)
    }

    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ 
      data,
      total: data?.length || 0,
      stats: {
        total: data?.length || 0,
        super_admin: data?.filter(u => u.role === 'super_admin').length || 0,
        atendimento: data?.filter(u => u.role === 'atendimento').length || 0,
        cliente: data?.filter(u => u.role === 'cliente').length || 0,
        ativos: data?.filter(u => u.ativo === true).length || 0,
        inativos: data?.filter(u => u.ativo === false).length || 0,
      }
    })
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/admin/usuarios - Criar novo usuário
export async function POST(request) {
  try {
    const isSuperAdmin = await checkSuperAdmin()
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { email, senha, nome, role, telefone, empresa } = body

    // Validações
    if (!email || !senha || !nome || !role) {
      return NextResponse.json({ 
        error: 'E-mail, senha, nome e role são obrigatórios' 
      }, { status: 400 })
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ 
        error: `Role inválido. Valores permitidos: ${VALID_ROLES.join(', ')}` 
      }, { status: 400 })
    }

    if (senha.length < 6) {
      return NextResponse.json({ 
        error: 'Senha deve ter pelo menos 6 caracteres' 
      }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
    }

    const supabase = createClient()
    const adminClient = require('@/lib/supabase/admin').createAdminClient()

    // Criar usuário no Auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome, role }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Criar registro na tabela usuarios
    const { data: usuario, error: dbError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email,
        nome,
        role,
        telefone: telefone || null,
        empresa: empresa || null,
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      // Deletar usuário do auth se falhar
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      data: usuario,
      message: 'Usuário criado com sucesso'
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
