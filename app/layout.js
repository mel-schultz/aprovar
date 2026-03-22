import './globals.css'
import { createClient } from '../lib/supabase/server'
import AppLayout from '../components/layout/AppLayout'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Aprovar',
  description: 'Sistema de aprovação de documentos',
}

async function getProfile() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return profile
  } catch (error) {
    console.error('Erro ao buscar profile:', error)
    return null
  }
}

export default async function RootLayout({ children }) {
  const profile = await getProfile()

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          {`
            :root {
              --brand: #0ea472;
              --brand-light: #dcf8ed;
              --surface: #ffffff;
              --surface-2: #fafafa;
              --surface-3: #f0f0f0;
              --text-1: #1a1a1a;
              --text-2: #666666;
              --text-3: #999999;
              --border: #e0e0e0;
              --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            html, body {
              height: 100%;
              font-family: var(--font-display);
              background: var(--surface-2);
              color: var(--text-1);
            }

            body {
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
            }

            button, input, textarea, select {
              font-family: inherit;
              font-size: inherit;
            }

            a {
              color: inherit;
              text-decoration: none;
            }
          `}
        </style>
      </head>
      <body>
        <AppLayout profile={profile}>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}
