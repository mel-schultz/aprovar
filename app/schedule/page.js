import { createClient } from '../../lib/supabase/server'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'
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

  const [profile, { data: scheduled }] = await Promise.all([
    getOrCreateProfile(supabase, user),
    supabase.from('deliverables').select('id,title,status,scheduled_at,network,clients(name)').eq('profile_id', user.id).gte('scheduled_at', from).lte('scheduled_at', to),
  ])

  return (
    <AppLayout profile={profile}>
      <ScheduleClient initialScheduled={scheduled || []} userId={user.id} />
    </AppLayout>
  )
}
