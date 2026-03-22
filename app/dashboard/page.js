import { getDeliverablesWithClientName } from '../../lib/supabase/queries'
import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import DashboardClient from './DashboardClient'
import { getOrCreateProfile } from '../../lib/supabase/getOrCreateProfile'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.log('⚠️ Dashboard: Sessão não encontrada, redirecionando para login')
      redirect('/login')
    }

    console.log('✅ Dashboard: Sessão encontrada para', session.user.email)

    // Obter perfil com melhor tratamento de erro
    let profile
    try {
      profile = await getOrCreateProfile(supabase, session.user)
      console.log('✅ Dashboard: Perfil obtido:', profile?.role)
    } catch (profileError) {
      console.error('❌ Dashboard: Erro ao obter perfil:', profileError)
      // Usar perfil mínimo se falhar
      profile = {
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || 'Usuário',
        role: 'approver'
      }
    }

    // Cliente não acessa dashboard
    if (profile?.role === 'client') {
      console.log('⚠️ Dashboard: Cliente não tem acesso, redirecionando para portal')
      redirect('/portal')
    }

    // Obter dados com tratamento individual de erros
    console.log('📊 Dashboard: Iniciando queries de dados...')
    
    let clientsCount = 0
    let pendingCount = 0
    let approvedCount = 0
    let scheduledCount = 0
    let recent = []

    try {
      const { count: cc } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', session.user.id)
      clientsCount = cc || 0
      console.log('✅ Clientes:', clientsCount)
    } catch (err) {
      console.error('❌ Erro ao contar clientes:', err)
    }

    try {
      const { count: pc } = await supabase
        .from('deliverables')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', session.user.id)
        .eq('status', 'pending')
      pendingCount = pc || 0
      console.log('✅ Pendentes:', pendingCount)
    } catch (err) {
      console.error('❌ Erro ao contar pendentes:', err)
    }

    try {
      const { count: ac } = await supabase
        .from('deliverables')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', session.user.id)
        .eq('status', 'approved')
      approvedCount = ac || 0
      console.log('✅ Aprovados:', approvedCount)
    } catch (err) {
      console.error('❌ Erro ao contar aprovados:', err)
    }

    try {
      const { count: sc } = await supabase
        .from('deliverables')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', session.user.id)
        .not('scheduled_at', 'is', null)
        .neq('status', 'approved')
      scheduledCount = sc || 0
      console.log('✅ Agendados:', scheduledCount)
    } catch (err) {
      console.error('❌ Erro ao contar agendados:', err)
    }

    try {
      const result = await getDeliverablesWithClientName(supabase, {
        profileId: session.user.id,
        fields: 'id,title,status,created_at,client_id',
        orderBy: { column: 'created_at', ascending: false },
        limit: 6
      })
      recent = result.data || []
      console.log('✅ Entregáveis recentes:', recent.length)
    } catch (err) {
      console.error('❌ Erro ao obter entregáveis recentes:', err)
      recent = []
    }

    console.log('✅ Dashboard: Todos os dados obtidos com sucesso')

  return (
    <AppLayout profile={profile}>
      <DashboardClient
        profile={profile}
        stats={{ 
          clients: clientsCount || 0, 
          pending: pendingCount || 0, 
          approved: approvedCount || 0, 
          scheduled: scheduledCount || 0 
        }}
        recent={recent || []}
      />
    </AppLayout>
  )
  } catch (error) {
    console.error('❌ Dashboard: Erro fatal:', error)
    // Não redirecionar, apenas logar o erro para debugging
    throw error
  }
}
