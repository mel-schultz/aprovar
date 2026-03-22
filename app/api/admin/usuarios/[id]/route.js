import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const SUPER_ADMIN = 'mel.schultz@yahoo.com'
const VALID_ROLES = ['super_admin', 'atendimento', 'cliente']

async function checkSuperAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.email !== SUPER_ADMIN) {
    return false
  }
  return true
}

// GET /api/admin/usuarios/[id] - Obter usuário específico
export async function GET(request, { params }) {
  try {
    const isSuperAdmin = await checkSuperAdmin()
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { id } = params
    const supabase = createClient()

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/admin/usuarios/[id] - Editar usuário
export async function PATCH(request, { params }) {
  try {
    const isSuperAdmin = await checkSuperAdmin()
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { nome, role, telefone, empresa, ativo, senha } = body

    // Validar role se foi alterado
    if (role && !VALID_ROLES.includes(role)) {
      return NextResponse.json({ 
        error: `Role inválido. Valores permitidos: ${VALID_ROLES.join(', ')}` 
      }, { status: 400 })
    }

    // Validar senha se foi informada
    if (senha && senha.length < 6) {
      return NextResponse.json({ 
        error: 'Senha deve ter pelo menos 6 caracteres' 
      }, { status: 400 })
    }

    const supabase = createClient()
    const adminClient = require('@/lib/supabase/admin').createAdminClient()

    // Atualizar senha se fornecida
    if (senha) {
      const { error: pwdError } = await adminClient.auth.admin.updateUserById(id, {
        password: senha
      })
      if (pwdError) throw pwdError
    }

    // Atualizar dados do usuário
    const updateData = {
      updated_at: new Date().toISOString()
    }

    if (nome) updateData.nome = nome
    if (role) updateData.role = role
    if (telefone !== undefined) updateData.telefone = telefone
    if (empresa !== undefined) updateData.empresa = empresa
    if (ativo !== undefined) updateData.ativo = ativo

    const { data, error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      data,
      message: 'Usuário atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/usuarios/[id] - Deletar usuário
export async function DELETE(request, { params }) {
  try {
    const isSuperAdmin = await checkSuperAdmin()
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { id } = params

    // Proteger super admin
    const supabase = createClient()
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('email, role')
      .eq('id', id)
      .single()

    if (usuario?.role === 'super_admin') {
      return NextResponse.json({ 
        error: 'Não é possível deletar super admin' 
      }, { status: 403 })
    }

    const adminClient = require('@/lib/supabase/admin').createAdminClient()

    // Deletar do Auth
    const { error: authError } = await adminClient.auth.admin.deleteUser(id)
    if (authError) throw authError

    // Deletar da tabela usuarios
    const { error: dbError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)

    if (dbError) throw dbError

    return NextResponse.json({ 
      message: 'Usuário deletado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
