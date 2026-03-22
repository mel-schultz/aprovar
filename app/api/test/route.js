import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('🧪 TEST API - Verificando credenciais...')

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({
        success: false,
        error: 'Credenciais do Supabase não configuradas',
        details: {
          urlConfigured: !!supabaseUrl,
          keyConfigured: !!supabaseKey,
        }
      }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      return Response.json({
        success: false,
        error: error.message,
        code: error.code,
      }, { status: 400 })
    }

    return Response.json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    }, { status: 201 })

  } catch (err) {
    return Response.json({
      success: false,
      error: 'Erro no servidor',
      message: err.message,
    }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    return Response.json({
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        supabaseUrlExists: !!supabaseUrl,
        supabaseKeyExists: !!supabaseKey,
      },
      message: 'API de teste funcionando',
    }, { status: 200 })

  } catch (err) {
    return Response.json({
      success: false,
      error: err.message,
    }, { status: 500 })
  }
}
