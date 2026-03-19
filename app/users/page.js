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

  // Guard duplo: middleware + server component
  if (profile?.role !== 'admin') redirect('/portal')

  // Busca todos os usuários (a view já une com client_name)
  const [
    { data: users,   error: usersErr },
    { data: clients, error: clientsErr },
  ] = await Promise.all([
    supabase
      .from('users_with_clients')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('clients')
      .select('id, name')
      .order('name'),
  ])

  if (usersErr)   console.error('users error:', usersErr.message)
  if (clientsErr) console.error('clients error:', clientsErr.message)

  return (
    <AppLayout profile={profile}>
      <UsersClient
        initialUsers={users   || []}
        clients={clients      || []}
        currentUserId={session.user.id}
      />
    </AppLayout>
  )
}
