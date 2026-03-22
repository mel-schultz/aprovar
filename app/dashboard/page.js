import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import DashboardClient from './DashboardClient'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  console.log('=== DASHBOARD INICIANDO ===')
  
  const supabase = createClient()
  console.log('✅ [1/4] Supabase cliente criado')
  
  const { data: { session } } = await supabase.auth.getSession()
  console.log('✅ [2/4] Session obtida:', session?.user?.email)
  
  if (!session) {
    redirect('/login')
  }

  // Perfil MUITO simplificado - sem getOrCreateProfile
  const profile = {
    id: session.user.id,
    email: session.user.email,
    full_name: session.user.user_metadata?.full_name || 'Usuário',
    nome: session.user.user_metadata?.full_name || 'Usuário',
  }
  console.log('✅ [3/4] Perfil criado para:', profile.email)

  // Dados VAZIOS por enquanto - sem queries
  const stats = { clients: 0, pending: 0, approved: 0, scheduled: 0 }
  const recent = []
  console.log('✅ [4/4] Dados vazios preparados')
  console.log('=== DASHBOARD RENDERIZANDO ===')

  return (
    <AppLayout profile={profile}>
      <DashboardClient
        profile={profile}
        stats={stats}
        recent={recent}
      />
    </AppLayout>
  )
}
