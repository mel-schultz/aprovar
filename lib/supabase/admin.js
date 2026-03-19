import { createClient } from '@supabase/supabase-js'

// ATENÇÃO: este client usa a service role key — nunca importe
// este módulo em arquivos com 'use client' ou em Server Components
// que possam ser expostos ao browser. Apenas em /app/api/** routes.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
