import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import DashboardClient from './DashboardClient'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Busca perfil — se não existir ainda (trigger ainda não rodou),
  // cria um perfil vazio para não quebrar a página
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    const { data: created } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: user.user_metadata?.full_name || null })
      .select()
      .single()
    profile = created
  }

  const [
    { count: clientsCount },
    { count: pendingCount },
    { count: approvedCount },
    { count: scheduledCount },
    { data: recent },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('profile_id', user.id),
    supabase.from('deliverables').select('*', { count: 'exact', head: true }).eq('profile_id', user.id).eq('status', 'pending'),
    supabase.from('deliverables').select('*', { count: 'exact', head: true }).eq('profile_id', user.id).eq('status', 'approved'),
    supabase.from('deliverables').select('*', { count: 'exact', head: true }).eq('profile_id', user.id).not('scheduled_at', 'is', null),
    supabase.from('deliverables').select('id,title,status,created_at,clients(name)').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(6),
  ])

  return (
    <AppLayout profile={profile}>
      <DashboardClient
        profile={profile}
        stats={{
          clients:   clientsCount  || 0,
          pending:   pendingCount  || 0,
          approved:  approvedCount || 0,
          scheduled: scheduledCount || 0,
        }}
        recent={recent || []}
      />
    </AppLayout>
  )
}
