'use client'

import { useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function AuthListener() {
  useEffect(() => {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        window.location.replace('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}
