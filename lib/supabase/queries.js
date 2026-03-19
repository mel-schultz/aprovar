
/**
 * Colunas da tabela clients separadas por nível de suporte:
 * - BASE: existem em qualquer versão do banco
 * - EXTENDED: adicionadas via migration (whatsapp, logo_url, notes)
 */
const CLIENTS_BASE_COLS     = ['id', 'name', 'email', 'profile_id', 'created_at']
const CLIENTS_EXTENDED_COLS = ['whatsapp', 'logo_url', 'notes']
const CLIENTS_ALL_COLS      = [...CLIENTS_BASE_COLS, ...CLIENTS_EXTENDED_COLS].join(',')
const CLIENTS_BASE_SEL      = CLIENTS_BASE_COLS.join(',')

/**
 * Detecta se um erro é de coluna/cache inexistente.
 */
function isColumnError(error) {
  if (!error || !error.message) return false
  const msg = error.message.toLowerCase()
  return msg.includes('column') || msg.includes('schema cache') || msg.includes('not found')
}

/**
 * Tenta o insert/update com payload completo. Se falhar por coluna
 * inexistente, remove os campos opcionais e retenta.
 */
async function safeClientUpsert(supabase, operation, payload) {
  // Tentativa 1: payload completo
  const { data, error } = await operation(payload)
  if (!error) return { data, error: null }
  if (!isColumnError(error)) return { data: null, error }

  // Tentativa 2: remove colunas opcionais do payload
  const safePayload = { ...payload }
  CLIENTS_EXTENDED_COLS.forEach(col => delete safePayload[col])
  const { data: data2, error: error2 } = await operation(safePayload)
  return { data: data2, error: error2 }
}

/**
 * SELECT seguro em clients: tenta com todas as colunas, cai para base se falhar.
 */
async function safeClientsSelect(supabase, buildQuery) {
  // Tentativa 1: todas as colunas
  const { data, error } = await buildQuery(CLIENTS_ALL_COLS)
  if (!error) return { data, error: null }
  if (!isColumnError(error)) return { data: null, error }

  // Tentativa 2: apenas colunas base — preenche opcionais com null
  const { data: rows, error: err2 } = await buildQuery(CLIENTS_BASE_SEL)
  if (err2) return { data: null, error: err2 }
  const filled = (rows || []).map(r => ({
    whatsapp: null, logo_url: null, notes: null, ...r,
  }))
  return { data: filled, error: null }
}

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
  // Tentativa 1: select completo com embedded relation approvers(count)
  const { data, error } = await safeClientsSelect(
    supabase,
    (cols) => supabase
      .from('clients')
      .select(`${cols}, approvers(count)`)
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
  )
  if (!error) return { data, error: null }

  // Tentativa 2: sem embedded relation — conta approvers manualmente
  const { data: clients, error: cErr } = await safeClientsSelect(
    supabase,
    (cols) => supabase
      .from('clients')
      .select(cols)
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
  )
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
  // Remove colunas opcionais do payload se schema cache não as reconhece
  const tryInsert = async (payload) => {
    // Tentativa com todas as colunas + embedded relation
    const { data: d1, error: e1 } = await supabase
      .from('clients').insert(payload)
      .select(`${CLIENTS_ALL_COLS}, approvers(count)`).single()
    if (!e1) return { data: d1, error: null }

    // Tentativa só colunas base + embedded relation
    if (isColumnError(e1)) {
      const safeP = { ...payload }
      CLIENTS_EXTENDED_COLS.forEach(c => delete safeP[c])
      const { data: d2, error: e2 } = await supabase
        .from('clients').insert(safeP)
        .select(`${CLIENTS_BASE_SEL}, approvers(count)`).single()
      if (!e2) return { data: { whatsapp: null, logo_url: null, notes: null, ...d2 }, error: null }

      // Último recurso: sem embedded relation
      if (isColumnError(e2)) {
        const { data: d3, error: e3 } = await supabase
          .from('clients').insert(safeP).select(CLIENTS_BASE_SEL).single()
        if (e3) return { data: null, error: e3 }
        return { data: { whatsapp: null, logo_url: null, notes: null, ...d3, approvers: [{ count: 0 }] }, error: null }
      }
      return { data: null, error: e2 }
    }
    return { data: null, error: e1 }
  }
  return tryInsert(form)
}

/**
 * Atualiza um client e retorna com approvers: [{ count: N }]
 */
export async function updateClientWithApproverCount(supabase, form, clientId) {
  const tryUpdate = async (payload) => {
    // Tentativa com todas as colunas + embedded
    const { data: d1, error: e1 } = await supabase
      .from('clients').update(payload).eq('id', clientId)
      .select(`${CLIENTS_ALL_COLS}, approvers(count)`).single()
    if (!e1) return { data: d1, error: null }

    // Tentativa só colunas base + embedded
    if (isColumnError(e1)) {
      const safeP = { ...payload }
      CLIENTS_EXTENDED_COLS.forEach(c => delete safeP[c])
      const { data: d2, error: e2 } = await supabase
        .from('clients').update(safeP).eq('id', clientId)
        .select(`${CLIENTS_BASE_SEL}, approvers(count)`).single()
      if (!e2) return { data: { whatsapp: null, logo_url: null, notes: null, ...d2 }, error: null }

      // Último recurso: sem embedded
      if (isColumnError(e2)) {
        const { data: d3, error: e3 } = await supabase
          .from('clients').update(safeP).eq('id', clientId)
          .select(CLIENTS_BASE_SEL).single()
        if (e3) return { data: null, error: e3 }
        const { data: approvers } = await supabase
          .from('approvers').select('client_id').eq('client_id', clientId)
        return {
          data: { whatsapp: null, logo_url: null, notes: null, ...d3, approvers: [{ count: (approvers||[]).length }] },
          error: null,
        }
      }
      return { data: null, error: e2 }
    }
    return { data: null, error: e1 }
  }
  return tryUpdate(form)
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
