import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import ApprovalsClient from './ApprovalsClient'

export const metadata = { title: 'Aprovações' }

export default async function ApprovalsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: deliverables }, { data: clients }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('deliverables').select('*, clients(name)').eq('profile_id', user.id).order('created_at', { ascending: false }),
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
