import { getDeliverablesWithClientName } from '../../../lib/supabase/queries'
import { createClient } from '../../../lib/supabase/server'
import ApproveClient from './ApproveClient'

export const metadata = { title: 'Aprovação de conteúdo' }

export default async function ApprovePage({ params }) {
  const { token } = params
  const supabase = createClient()

  // Busca o deliverable com nome do cliente (fallback manual se FK não estiver no cache)
  let deliverable = null
  const { data: d1, error: e1 } = await supabase
    .from('deliverables')
    .select('*, clients(id, name)')
    .eq('token', token)
    .single()

  if (!e1) {
    deliverable = d1
  } else {
    // Fallback: duas queries separadas
    const { data: d2 } = await supabase
      .from('deliverables')
      .select('*')
      .eq('token', token)
      .single()
    if (d2) {
      let clientData = null
      if (d2.client_id) {
        const { data: c } = await supabase
          .from('clients')
          .select('id, name')
          .eq('id', d2.client_id)
          .single()
        clientData = c
      }
      deliverable = { ...d2, clients: clientData }
    }
  }

  let approvers = []
  if (deliverable?.clients?.id) {
    const { data } = await supabase.from('approvers').select('*').eq('client_id', deliverable.clients.id)
    approvers = data || []
  }

  return <ApproveClient deliverable={deliverable} approvers={approvers} token={token} />
}
