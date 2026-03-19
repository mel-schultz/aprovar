import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import TeamClient from './TeamClient'

export const metadata = { title: 'Equipe' }

export default async function TeamPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: members }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('team_members').select('*').eq('profile_id', user.id).order('invited_at', { ascending: false }),
  ])

  return (
    <AppLayout profile={profile}>
      <TeamClient initialMembers={members || []} userId={user.id} />
    </AppLayout>
  )
}
