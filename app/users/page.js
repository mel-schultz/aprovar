import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import UsersClient from './UsersClient'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'

export const metadata = { title: 'Usuários' }

export default async function UsersPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const profile = await getOrCreateProfile(supabase, session.user)

  // Apenas admins acessam esta página
  if (profile?.role !== 'admin') redirect('/portal')

  const [{ data: users }, { data: clients }] = await Promise.all([
    supabase.from('users_with_clients').select('*').order('created_at', { ascending: false }),
    supabase.from('clients').select('id,name').eq('profile_id', session.user.id).order('name'),
  ])

  return (
    <AppLayout profile={profile}>
      <UsersClient
        initialUsers={users || []}
        clients={clients || []}
        currentUserId={session.user.id}
      />
    </AppLayout>
  )
}
