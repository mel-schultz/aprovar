import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Durante o build do Next.js, as variáveis de ambiente podem não estar presentes.
// Usamos valores placeholder para evitar erros de compilação.
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseKey || 'placeholder-key'

export const supabase = createClient(url, key)
