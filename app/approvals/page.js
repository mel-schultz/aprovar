import { createClient } from '../../lib/supabase/server'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'
import { getDeliverablesWithClientName } from '../../lib/supabase/queries'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import ApprovalsClient from './ApprovalsClient'

export const metadata = { title: 'Aprovações' }

export default async function ApprovalsPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')
  const user = session.user

  const [profile, { data: deliverables }, { data: clients }] = await Promise.all([
    getOrCreateProfile(supabase, user),
    getDeliverablesWithClientName(supabase, {
      profileId: user.id,
      orderBy: { column: 'created_at', ascending: false },
    }),
    supabase.from('clients').select('id,name').eq('profile_id', user.id).order('name'),
  ])

  return (
    <AppLayout profile={profile}>
      <ApprovalsClient
        initialDeliverables={deliverables || []}
        clients={clients || []}
        userId={user.id}
      />
    </AppLayout>
  )
}
