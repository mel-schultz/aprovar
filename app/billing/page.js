import { redirect } from 'next/navigation'

// Billing removido — todas as funcionalidades estão disponíveis sem restrição de plano
export default function BillingPage() {
  redirect('/settings')
}
