import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const ADMIN_ONLY_PATHS = ['/users']
const CLIENT_BLOCKED   = ['/dashboard', '/clients', '/approvals', '/schedule', '/team', '/integrations', '/settings', '/users']

export async function middleware(request) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name)          { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl
  const publicPaths  = ['/login', '/approve', '/api']
  const isPublic     = publicPaths.some(p => pathname.startsWith(p))

  // ── Sem sessão em rota protegida → login ───────────────────
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session) {
    // ── Busca o role do perfil ───────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', session.user.id)
      .single()

    const role     = profile?.role      ?? 'admin'
    const isActive = profile?.is_active ?? true

    // ── Conta inativa → logout ───────────────────────────────
    if (!isActive && !isPublic) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login?reason=inactive', request.url))
    }

    // ── Raiz e /login → destino correto por role ─────────────
    if (pathname === '/' || pathname === '/login') {
      const dest = role === 'client' ? '/portal' : '/dashboard'
      return NextResponse.redirect(new URL(dest, request.url))
    }

    // ── Cliente tenta acessar área de admin ──────────────────
    if (role === 'client') {
      const isBlocked = CLIENT_BLOCKED.some(p => pathname === p || pathname.startsWith(p + '/'))
      if (isBlocked) {
        return NextResponse.redirect(new URL('/portal', request.url))
      }
    }

    // ── Não-admin tenta acessar /users ────────────────────────
    if (role !== 'admin' && ADMIN_ONLY_PATHS.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/portal', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
