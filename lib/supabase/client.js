'use client'

import { createBrowserClient } from '@supabase/ssr'

let client = null

// Singleton: reutiliza a mesma instância durante toda a sessão do browser.
// Evita múltiplos listeners de onAuthStateChange e conflitos de token.
export function createClient() {
  if (client) return client
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return client
}
