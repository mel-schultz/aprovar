import { createClient } from '../../lib/supabase/server'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import ClientsClient from './ClientsClient'

export const metadata = { title: 'Clientes' }

export default async function ClientsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, { data: clients }] = await Promise.all([
    getOrCreateProfile(supabase, user),
    supabase.from('clients').select('*, approvers(count)').eq('profile_id', user.id).order('created_at', { ascending: false }),
  ])

  return (
    <AppLayout profile={profile}>
      <ClientsClient initialClients={clients || []} userId={user.id} />
    </AppLayout>
  )
}
