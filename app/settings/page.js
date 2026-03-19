import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import SettingsClient from './SettingsClient'

export const metadata = { title: 'Configurações' }

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return <AppLayout profile={profile}><SettingsClient profile={profile} userEmail={user.email} /></AppLayout>
}
