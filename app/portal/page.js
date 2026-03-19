import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import PortalClient from './PortalClient'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'

export const metadata = { title: 'Portal do Cliente — Aprovar' }

export default async function PortalPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const profile = await getOrCreateProfile(supabase, session.user)

  // Admins não acessam o portal — vão para o dashboard
  if (profile?.role === 'admin') redirect('/dashboard')

  // Busca os entregáveis do cliente vinculado
  let deliverables = []
  let clientName = null

  if (profile?.linked_client_id) {
    const [{ data: dels }, { data: client }] = await Promise.all([
      supabase
        .from('deliverables')
        .select('id,title,description,status,file_url,file_type,network,token,scheduled_at,created_at')
        .eq('client_id', profile.linked_client_id)
        .order('created_at', { ascending: false }),
      supabase
        .from('clients')
        .select('name')
        .eq('id', profile.linked_client_id)
        .single(),
    ])
    deliverables = dels || []
    clientName = client?.name || null
  }

  return (
    <PortalClient
      profile={profile}
      deliverables={deliverables}
      clientName={clientName}
    />
  )
}
