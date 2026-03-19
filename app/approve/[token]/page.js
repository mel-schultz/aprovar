import { createClient } from '../../../lib/supabase/server'
import ApproveClient from './ApproveClient'

export const metadata = { title: 'Aprovação de conteúdo' }

export default async function ApprovePage({ params }) {
  const { token } = params
  const supabase = createClient()

  const { data: deliverable } = await supabase
    .from('deliverables')
    .select('*, clients(id, name)')
    .eq('token', token)
    .single()

  let approvers = []
  if (deliverable?.clients?.id) {
    const { data } = await supabase.from('approvers').select('*').eq('client_id', deliverable.clients.id)
    approvers = data || []
  }

  return <ApproveClient deliverable={deliverable} approvers={approvers} token={token} />
}
