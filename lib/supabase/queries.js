/**
 * lib/supabase/queries.js
 *
 * Helpers centralizados para queries que usam relacionamentos embedded
 * (sintaxe tabela(campo)). Se o PostgREST não reconhecer a FK no schema
 * cache, estas funções fazem as queries manualmente e montam o mesmo
 * formato de resposta esperado pelos componentes.
 */

// ── clients com contagem de approvers ────────────────────────────────────────

/**
 * Retorna clients com a propriedade approvers: [{ count: N }]
 * Tenta primeiro a sintaxe embedded; se falhar, faz duas queries separadas.
 */
export async function getClientsWithApproverCount(supabase, profileId) {
  // Tentativa 1: sintaxe embedded (funciona quando o schema cache está OK)
  const { data, error } = await supabase
    .from('clients')
    .select('*, approvers(count)')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (!error) return { data, error: null }

  // Tentativa 2: duas queries separadas (fallback robusto)
  const { data: clients, error: cErr } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (cErr) return { data: null, error: cErr }

  const clientIds = (clients || []).map(c => c.id)

  let approverCounts = []
  if (clientIds.length > 0) {
    const { data: approvers } = await supabase
      .from('approvers')
      .select('client_id')
      .in('client_id', clientIds)
    approverCounts = approvers || []
  }

  const data2 = (clients || []).map(c => ({
    ...c,
    approvers: [{ count: approverCounts.filter(a => a.client_id === c.id).length }],
  }))

  return { data: data2, error: null }
}

/**
 * Insere um client e retorna com approvers: [{ count: 0 }]
 */
export async function insertClientWithApproverCount(supabase, form) {
  const { data, error } = await supabase
    .from('clients')
    .insert(form)
    .select('*, approvers(count)')
    .single()

  if (!error) return { data, error: null }

  // Fallback: insert simples + monta objeto manualmente
  const { data: inserted, error: iErr } = await supabase
    .from('clients')
    .insert(form)
    .select('*')
    .single()

  if (iErr) return { data: null, error: iErr }
  return { data: { ...inserted, approvers: [{ count: 0 }] }, error: null }
}

/**
 * Atualiza um client e retorna com approvers: [{ count: N }]
 */
export async function updateClientWithApproverCount(supabase, form, clientId) {
  const { data, error } = await supabase
    .from('clients')
    .update(form)
    .eq('id', clientId)
    .select('*, approvers(count)')
    .single()

  if (!error) return { data, error: null }

  // Fallback
  const { data: updated, error: uErr } = await supabase
    .from('clients')
    .update(form)
    .eq('id', clientId)
    .select('*')
    .single()

  if (uErr) return { data: null, error: uErr }

  const { data: approvers } = await supabase
    .from('approvers')
    .select('client_id')
    .eq('client_id', clientId)

  return {
    data: { ...updated, approvers: [{ count: (approvers || []).length }] },
    error: null,
  }
}

// ── deliverables com nome do client ──────────────────────────────────────────

/**
 * Retorna deliverables com a propriedade clients: { name: '...' }
 * Tenta primeiro a sintaxe embedded; se falhar, faz queries separadas.
 */
export async function getDeliverablesWithClientName(supabase, { profileId, fields = '*', filters = [], orderBy = { column: 'created_at', ascending: false }, limit = null } = {}) {
  const selectStr = fields === '*' ? '*, clients(name)' : `${fields},clients(name)`

  let query = supabase.from('deliverables').select(selectStr)
  if (profileId) query = query.eq('profile_id', profileId)
  filters.forEach(([col, op, val]) => { query = query[op](col, val) })
  query = query.order(orderBy.column, { ascending: orderBy.ascending })
  if (limit) query = query.limit(limit)

  const { data, error } = await query

  if (!error) return { data, error: null }

  // Fallback: query sem embedded
  const fieldsNoClient = fields === '*' ? '*' : fields.replace(',clients(name)', '').replace('clients(name),', '').replace('clients(name)', '')
  let q2 = supabase.from('deliverables').select(fieldsNoClient || '*')
  if (profileId) q2 = q2.eq('profile_id', profileId)
  filters.forEach(([col, op, val]) => { q2 = q2[op](col, val) })
  q2 = q2.order(orderBy.column, { ascending: orderBy.ascending })
  if (limit) q2 = q2.limit(limit)

  const { data: deliverables, error: dErr } = await q2
  if (dErr) return { data: null, error: dErr }

  const clientIds = [...new Set((deliverables || []).map(d => d.client_id).filter(Boolean))]
  let clientMap = {}
  if (clientIds.length > 0) {
    const { data: clients } = await supabase
      .from('clients')
      .select('id, name')
      .in('id', clientIds)
    ;(clients || []).forEach(c => { clientMap[c.id] = c })
  }

  const data2 = (deliverables || []).map(d => ({
    ...d,
    clients: clientMap[d.client_id] ? { name: clientMap[d.client_id].name } : null,
  }))

  return { data: data2, error: null }
}
