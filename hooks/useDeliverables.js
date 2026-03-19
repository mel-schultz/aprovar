'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '../lib/supabase/client'

export function useDeliverables(userId, filters = {}) {
  const supabase = createClient()
  const [deliverables, setDeliverables] = useState([])
  const [loading, setLoading]           = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    let query = supabase
      .from('deliverables')
      .select('*, clients(name)')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.clientId) query = query.eq('client_id', filters.clientId)

    const { data } = await query
    setDeliverables(data || [])
    setLoading(false)
  }, [userId, filters.status, filters.clientId])

  useEffect(() => { fetch() }, [fetch])

  // Realtime — atualiza status ao vivo quando cliente aprova
  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel(`deliverables:${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'deliverables',
        filter: `profile_id=eq.${userId}`,
      }, payload => {
        setDeliverables(prev =>
          prev.map(d => d.id === payload.new.id ? { ...d, ...payload.new } : d)
        )
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  async function create(data) {
    const { data: created, error } = await supabase
      .from('deliverables')
      .insert({ ...data, profile_id: userId, status: 'pending' })
      .select('*, clients(name)')
      .single()
    if (!error) setDeliverables(prev => [created, ...prev])
    return { data: created, error }
  }

  async function update(id, updates) {
    const { data: updated, error } = await supabase
      .from('deliverables').update(updates).eq('id', id)
      .select('*, clients(name)').single()
    if (!error) setDeliverables(prev => prev.map(d => d.id === id ? updated : d))
    return { data: updated, error }
  }

  async function remove(id) {
    const { error } = await supabase.from('deliverables').delete().eq('id', id)
    if (!error) setDeliverables(prev => prev.filter(d => d.id !== id))
    return { error }
  }

  return { deliverables, loading, fetch, create, update, remove }
}
