import { getDeliverablesWithClientName } from '../../lib/supabase/queries'
import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import DashboardClient from './DashboardClient'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const profile = await getOrCreateProfile(supabase, session.user)

  // Cliente não acessa dashboard
  if (profile?.role === 'client') redirect('/portal')

  const [
    { count: clientsCount },
    { count: pendingCount },
    { count: approvedCount },
    { count: scheduledCount },
    { data: recent },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('profile_id', session.user.id),
    supabase.from('deliverables').select('*', { count: 'exact', head: true }).eq('profile_id', session.user.id).eq('status', 'pending'),
    supabase.from('deliverables').select('*', { count: 'exact', head: true }).eq('profile_id', session.user.id).eq('status', 'approved'),
    // Agendados = entregáveis com data agendada mas NÃO aprovados ainda
    supabase.from('deliverables').select('*', { count: 'exact', head: true }).eq('profile_id', session.user.id).not('scheduled_at', 'is', null).neq('status', 'approved'),
    getDeliverablesWithClientName(supabase, { profileId: session.user.id, fields: 'id,title,status,created_at,client_id', orderBy: { column: 'created_at', ascending: false }, limit: 6 }),
  ])

  return (
    <AppLayout profile={profile}>
      <DashboardClient
        profile={profile}
        stats={{ clients: clientsCount||0, pending: pendingCount||0, approved: approvedCount||0, scheduled: scheduledCount||0 }}
        recent={recent || []}
      />
    </AppLayout>
  )
}
