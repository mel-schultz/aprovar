'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'

export function useProfile() {
  const supabase = createClient()
  const [profile, setProfile] = useState(null)
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (!user) { setLoading(false); return }
      supabase.from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => { setProfile(data); setLoading(false) })
    })
  }, [])

  async function refresh() {
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
  }

  async function update(updates) {
    if (!user) return { error: new Error('Não autenticado') }
    const { data, error } = await supabase
      .from('profiles').update(updates).eq('id', user.id).select().single()
    if (!error) setProfile(data)
    return { data, error }
  }

  return { profile, user, loading, refresh, update }
}
