'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import AppLayout from '../../components/layout/AppLayout'

export default function DashboardLayout({ children }) {
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
          setProfile(profileData || null)
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user?.id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (mounted) {
            setProfile(profileData || null)
            setLoading(false)
          }
        } else {
          if (mounted) {
            setLoading(false)
          }
          router.push('/login')
        }
      }
    )

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [router, supabase])

  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando...</div>
  }

  return (
    <AppLayout profile={profile}>
      {children}
    </AppLayout>
  )
}
