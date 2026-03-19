import { createClient } from '../../lib/supabase/server'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import SettingsClient from './SettingsClient'

export const metadata = { title: 'Configurações' }

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')
  const user = session.user
  const profile = await getOrCreateProfile(supabase, user)
  return <AppLayout profile={profile}><SettingsClient profile={profile} userEmail={user.email} /></AppLayout>
}
