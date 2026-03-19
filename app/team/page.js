import { createClient } from '../../lib/supabase/server'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import TeamClient from './TeamClient'

export const metadata = { title: 'Equipe' }

export default async function TeamPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, { data: members }] = await Promise.all([
    getOrCreateProfile(supabase, user),
    supabase.from('team_members').select('*').eq('profile_id', user.id).order('invited_at', { ascending: false }),
  ])

  return (
    <AppLayout profile={profile}>
      <TeamClient initialMembers={members || []} userId={user.id} />
    </AppLayout>
  )
}
