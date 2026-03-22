'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '../lib/supabase/client'

// Helper local: busca deliverables com clients(name), com fallback manual
async function fetchDeliverablesWithClient(supabase, userId, filters = {}) {
  let query = supabase
    .from('deliverables')
    .select('*, clients(name)')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })

  if (filters.status)   query = query.eq('status', filters.status)
  if (filters.clientId) query = query.eq('client_id', filters.clientId)

  const { data, error } = await query
  if (!error) return data || []

  // Fallback: query sem embedded relation
  let q2 = supabase
    .from('deliverables')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })

  if (filters.status)   q2 = q2.eq('status', filters.status)
  if (filters.clientId) q2 = q2.eq('client_id', filters.clientId)

  const { data: rows } = await q2
  if (!rows) return []

  const clientIds = [...new Set(rows.map(d => d.client_id).filter(Boolean))]
  let clientMap = {}
  if (clientIds.length > 0) {
    const { data: clients } = await supabase
      .from('clients')
      .select('id, name')
      .in('id', clientIds)
    ;(clients || []).forEach(c => { clientMap[c.id] = c })
  }

  return rows.map(d => ({
    ...d,
    clients: clientMap[d.client_id] ? { name: clientMap[d.client_id].name } : null,
  }))
}

// Helper: insert/update com clients(name), com fallback manual
async function upsertDeliverable(supabase, method, payload, id = null) {
  let q = method === 'insert'
    ? supabase.from('deliverables').insert(payload)
    : supabase.from('deliverables').update(payload).eq('id', id)

  const { data, error } = await q.select('*, clients(name)').single()
  if (!error) return { data, error: null }

  // Fallback
  let q2 = method === 'insert'
    ? supabase.from('deliverables').insert(payload)
    : supabase.from('deliverables').update(payload).eq('id', id)

  const { data: row, error: err2 } = await q2.select('*').single()
  if (err2) return { data: null, error: err2 }

  let clientData = null
  if (row?.client_id) {
    const { data: c } = await supabase
      .from('clients').select('id, name').eq('id', row.client_id).single()
    clientData = c
  }
  return { data: { ...row, clients: clientData }, error: null }
}

export function useDeliverables(userId, filters = {}) {
  const supabase = createClient()
  const [deliverables, setDeliverables] = useState([])
  // Garante que setDeliverables nunca recebe undefined
  const safeSet = (val) => setDeliverables(Array.isArray(val) ? val : [])
  const [loading, setLoading]           = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    const data = await fetchDeliverablesWithClient(supabase, userId, filters)
    safeSet(data)
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
    const { data: created, error } = await upsertDeliverable(
      supabase, 'insert', { ...data, profile_id: userId, status: 'pending' }
    )
    if (!error) setDeliverables(prev => [created, ...prev])
    return { data: created, error }
  }

  async function update(id, updates) {
    const { data: updated, error } = await upsertDeliverable(supabase, 'update', updates, id)
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
