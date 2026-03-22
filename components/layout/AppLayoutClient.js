'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import AppLayout from './AppLayout'

export default function AppLayoutClient({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user?.id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (mounted) {
            setProfile(profileData || null)
          }
        }

        if (mounted) {
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
          }
        } else {
          if (mounted) {
            setProfile(null)
          }
        }

        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [supabase])

  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando...</div>
  }

  return (
    <AppLayout profile={profile}>
      {children}
    </AppLayout>
  )
}
