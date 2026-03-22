import { createClient } from './admin'

/**
 * Enviar email de recuperação de senha para um usuário
 * @param {string} email - Email do usuário
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function sendPasswordResetEmail(email) {
  try {
    const admin = createClient()
    
    const { error } = await admin.auth.admin.sendRawEmail({
      email: email,
      html: `
        <h2>Recuperação de Senha</h2>
        <p>Você solicitou uma recuperação de senha para sua conta no sistema Aprovar.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify?token=verify_reset_password&type=recovery&email=${encodeURIComponent(email)}" style="display: inline-block; padding: 10px 20px; background-color: #0ea472; color: white; text-decoration: none; border-radius: 5px;">
          Redefinir Senha
        </a>
        <p>Este link expira em 24 horas.</p>
        <p>Se você não solicitou isso, ignore este email.</p>
      `,
      subject: 'Recuperação de Senha - Aprovar'
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      return { success: false, error: error.message || 'Erro ao enviar email' }
    }

    return { success: true }
  } catch (err) {
    console.error('Erro inesperado:', err)
    return { success: false, error: err.message || 'Erro inesperado' }
  }
}

/**
 * Atualizar status ativo/inativo de um usuário
 * @param {string} userId - ID do usuário
 * @param {boolean} isActive - Se deve ser ativo ou não
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function updateUserActiveStatus(userId, isActive) {
  try {
    const admin = createClient()
    
    const { error } = await admin
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId)

    if (error) {
      console.error('Erro ao atualizar status:', error)
      return { success: false, error: error.message || 'Erro ao atualizar status' }
    }

    return { success: true }
  } catch (err) {
    console.error('Erro inesperado:', err)
    return { success: false, error: err.message || 'Erro inesperado' }
  }
}

/**
 * Deletar um usuário completamente
 * @param {string} userId - ID do usuário
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function deleteUser(userId) {
  try {
    const admin = createClient()
    
    // Deletar o usuário da autenticação (isso cascata para profiles)
    const { error } = await admin.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Erro ao deletar usuário:', error)
      return { success: false, error: error.message || 'Erro ao deletar usuário' }
    }

    return { success: true }
  } catch (err) {
    console.error('Erro inesperado:', err)
    return { success: false, error: err.message || 'Erro inesperado' }
  }
}

/**
 * Criar um novo usuário do sistema
 * @param {Object} data - Dados do usuário
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function createSystemUser(data) {
  try {
    const admin = createClient()
    
    // Criar usuário na autenticação
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name,
        role: data.role,
        company: data.company,
      }
    })

    if (authError) {
      console.error('Erro ao criar usuário:', authError)
      return { success: false, error: authError.message || 'Erro ao criar usuário' }
    }

    // O perfil será criado automaticamente pelo trigger
    // Mas vamos fazer update para garantir todos os campos
    const { error: profileError } = await admin
      .from('profiles')
      .update({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        role: data.role,
        linked_client_id: data.linked_client_id || null,
        is_active: true,
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Erro ao atualizar perfil:', profileError)
      // Não falhar aqui pois o usuário já foi criado
    }

    return { success: true, data: authData }
  } catch (err) {
    console.error('Erro inesperado:', err)
    return { success: false, error: err.message || 'Erro inesperado' }
  }
}

/**
 * Atualizar dados de um usuário
 * @param {string} userId - ID do usuário
 * @param {Object} data - Dados a atualizar
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function updateSystemUser(userId, data) {
  try {
    const admin = createClient()

    // Atualizar apenas o email na autenticação se foi mudado
    if (data.email && data.email_changed) {
      const { error: authError } = await admin.auth.admin.updateUserById(userId, {
        email: data.email
      })

      if (authError) {
        console.error('Erro ao atualizar email:', authError)
        return { success: false, error: authError.message || 'Erro ao atualizar email' }
      }
    }

    // Atualizar senha se foi fornecida
    if (data.password && data.password.trim() !== '') {
      const { error: authError } = await admin.auth.admin.updateUserById(userId, {
        password: data.password
      })

      if (authError) {
        console.error('Erro ao atualizar senha:', authError)
        return { success: false, error: authError.message || 'Erro ao atualizar senha' }
      }
    }

    // Atualizar perfil
    const { error: profileError } = await admin
      .from('profiles')
      .update({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        role: data.role,
        linked_client_id: data.linked_client_id || null,
        is_active: data.is_active,
      })
      .eq('id', userId)

    if (profileError) {
      console.error('Erro ao atualizar perfil:', profileError)
      return { success: false, error: profileError.message || 'Erro ao atualizar perfil' }
    }

    return { success: true }
  } catch (err) {
    console.error('Erro inesperado:', err)
    return { success: false, error: err.message || 'Erro inesperado' }
  }
}
