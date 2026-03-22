import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import UsuariosManagementClient from './UsuariosManagementClient'

export const metadata = { title: 'Gerenciar Usuários' }

const SUPER_ADMIN_EMAIL = 'mel.schultz@yahoo.com'

export default async function UsuariosPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Redirecionar se não estiver logado
  if (!session) {
    redirect('/login')
  }

  // Proteger: apenas Super Admin (mel.schultz@yahoo.com) pode acessar
  if (session.user.email !== SUPER_ADMIN_EMAIL) {
    redirect('/portal')
  }

  // Buscar perfil do usuário da tabela usuarios
  const { data: profile } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // Se não encontrar, usar informações da sessão
  const finalProfile = profile || { 
    email: session.user.email, 
    nome: session.user.user_metadata?.full_name || 'Super Admin',
    role: 'super_admin'
  }

  return (
    <AppLayout profile={finalProfile}>
      <UsuariosManagementClient />
    </AppLayout>
  )
}
