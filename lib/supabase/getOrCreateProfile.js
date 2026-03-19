/**
 * Busca o perfil do usuário. Se não existir ainda (race condition
 * entre o signup e o trigger do Supabase), cria um perfil mínimo.
 */
export async function getOrCreateProfile(supabase, user) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (existing) return existing

  const { data: created } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || null,
      company:   user.user_metadata?.company   || null,
    })
    .select()
    .single()

  return created
}
