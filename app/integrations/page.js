import { createClient } from '../../lib/supabase/server'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import IntegrationsClient from './IntegrationsClient'

export const metadata = { title: 'Integrações' }

export default async function IntegrationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const profile = await getOrCreateProfile(supabase, user)
  return <AppLayout profile={profile}><IntegrationsClient /></AppLayout>
}
