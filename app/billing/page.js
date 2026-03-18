import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import BillingClient from './BillingClient'

export const metadata = { title: 'Planos' }

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return <AppLayout profile={profile}><BillingClient profile={profile} /></AppLayout>
}
