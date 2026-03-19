import { createClient } from '../../lib/supabase/server'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'
import { getDeliverablesWithClientName } from '../../lib/supabase/queries'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import ScheduleClient from './ScheduleClient'

export const metadata = { title: 'Calendário' }

export default async function SchedulePage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')
  const user = session.user

  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const to   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [profile, { data: deliverables }] = await Promise.all([
    getOrCreateProfile(supabase, user),
    getDeliverablesWithClientName(supabase, {
      profileId: user.id,
      fields: 'id,title,status,scheduled_at,network,client_id',
      filters: [
        ['scheduled_at', 'gte', from],
        ['scheduled_at', 'lte', to],
      ],
      orderBy: { column: 'scheduled_at', ascending: true },
    }),
  ])

  return (
    <AppLayout profile={profile}>
      <ScheduleClient initialDeliverables={deliverables || []} userId={user.id} />
    </AppLayout>
  )
}
