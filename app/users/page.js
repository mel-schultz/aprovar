import { createClient } from '../../lib/supabase/server'
import { getClientsWithApproverCount } from '../../lib/supabase/queries'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import UsersClient from './UsersClient'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'

export const metadata = { title: 'Gerenciar Usuários' }

export default async function UsersPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const profile = await getOrCreateProfile(supabase, session.user)
  
  // Apenas admin pode acessar esta página
  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const [
    { data: systemUsers },
    { data: clients },
    { data: approvers },
  ] = await Promise.all([
    supabase
      .from('users_with_clients')
      .select('*')
      .order('created_at', { ascending: false }),
    getClientsWithApproverCount(supabase, session.user.id).then(r => ({ data: r.data ? [...r.data].sort((a,b)=>a.name.localeCompare(b.name)) : r.data, error: r.error })),
    (async () => {
      const { data: approverRows, error: aErr } = await supabase
        .from('approvers')
        .select('*, clients(name)')
        .order('name')
      if (!aErr) return { data: approverRows, error: null }
      // Fallback
      const { data: approverRows2 } = await supabase.from('approvers').select('*').order('name')
      if (!approverRows2) return { data: [], error: null }
      const cids = [...new Set(approverRows2.map(a => a.client_id).filter(Boolean))]
      let cmap = {}
      if (cids.length) {
        const { data: cls } = await supabase.from('clients').select('id,name').in('id', cids)
        ;(cls||[]).forEach(c => { cmap[c.id] = c })
      }
      return { data: approverRows2.map(a => ({ ...a, clients: cmap[a.client_id] || null })), error: null }
    })(),
  ])

  return (
    <AppLayout profile={profile}>
      <UsersClient
        initialSystemUsers={systemUsers || []}
        initialClients={clients        || []}
        initialApprovers={approvers    || []}
        currentUserId={session.user.id}
      />
    </AppLayout>
  )
}
