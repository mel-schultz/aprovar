import { createClient } from '../../lib/supabase/server'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'
import { getClientsWithApproverCount } from '../../lib/supabase/queries'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import ClientsClient from './ClientsClient'

export const metadata = { title: 'Clientes' }

export default async function ClientsPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')
  const user = session.user

  const [profile, { data: clients }] = await Promise.all([
    getOrCreateProfile(supabase, user),
    getClientsWithApproverCount(supabase, user.id),
  ])

  return (
    <AppLayout profile={profile}>
      <ClientsClient initialClients={clients || []} userId={user.id} />
    </AppLayout>
  )
}
