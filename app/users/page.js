import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import UsersClient from './UsersClient'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'

export const metadata = { title: 'Gerenciar Usuários' }

export default async function UsersPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const profile = await getOrCreateProfile(supabase, session.user)
  if (profile?.role !== 'admin') redirect('/portal')

  const [
    { data: systemUsers },
    { data: clients },
    { data: approvers },
  ] = await Promise.all([
    supabase
      .from('users_with_clients')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('clients')
      .select('*, approvers(count)')
      .order('name'),
    supabase
      .from('approvers')
      .select('*, clients(name)')
      .order('name'),
  ])

  return (
    <AppLayout profile={profile}>
      <UsersClient
        initialSystemUsers={systemUsers || []}
        initialClients={clients        || []}
        initialApprovers={approvers    || []}
        currentUserId={session.user.id}
      />
    </AppLayout>
  )
}
