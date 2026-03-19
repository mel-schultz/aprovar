/**
 * Busca o perfil do usuário pelo ID.
 * Se não existir (race condition entre signup e trigger), cria um perfil
 * completo com email, nome e role correto.
 *
 * Regra de role no upsert:
 *  - mel.schultz@yahoo.com → sempre 'admin'
 *  - qualquer outro → 'admin' por padrão (ajustável pelo admin depois)
 */

const ADMIN_EMAILS = ['mel.schultz@yahoo.com']

export async function getOrCreateProfile(supabase, user) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (existing) {
    // Garantir que o email está preenchido mesmo em perfis antigos
    if (!existing.email && user.email) {
      const { data: updated } = await supabase
        .from('profiles')
        .update({ email: user.email })
        .eq('id', user.id)
        .select()
        .single()
      return updated || existing
    }
    return existing
  }

  // Determina o role: admin_emails sempre são admin
  const role = ADMIN_EMAILS.includes(user.email?.toLowerCase()) ? 'admin' : 'admin'
  // (default 'admin' para o primeiro usuário — ajuste para 'client' se preferir)

  const { data: created } = await supabase
    .from('profiles')
    .upsert({
      id:        user.id,
      email:     user.email || null,
      full_name: user.user_metadata?.full_name
                 || user.email?.split('@')[0]
                 || null,
      company:   user.user_metadata?.company || null,
      role,
      is_active: true,
    })
    .select()
    .single()

  return created
}
