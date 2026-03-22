'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import UsersManagementClient from '../../../components/users/UsersManagementClient'

export default function UsersPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user?.id) {
          router.push('/login')
          return
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (mounted) {
          setProfile(profileData)

          // Se não for super admin, redirecionar
          if (!profileData?.is_super_admin && profileData?.role !== 'super_admin') {
            router.push('/dashboard')
          }

          setLoading(false)
        }
      } catch (error) {
        console.error('Erro ao carregar profile:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando...</div>
  }

  if (!profile?.is_super_admin && profile?.role !== 'super_admin') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Acesso Negado</h2>
        <p>Apenas super admin pode acessar esta página.</p>
      </div>
    )
  }

  return <UsersManagementClient profile={profile} />
}
