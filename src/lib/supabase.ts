import { createClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env || {}
const supabaseUrl = env.VITE_SUPABASE_URL as string
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set. Using placeholder values for development.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)
