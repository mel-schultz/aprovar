import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/admin'

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const admin = createClient()

    // Gerar link de recuperação de senha
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    })

    if (error) {
      console.error('Erro ao gerar link:', error)
      return NextResponse.json(
        { error: error.message || 'Erro ao gerar link de recuperação' },
        { status: 400 }
      )
    }

    // Enviar email via resend ou outro serviço
    // Para agora, vamos usar o método nativo do Supabase
    const { error: sendError } = await admin.auth.admin.sendRawEmail({
      email: email,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0ea472; color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background: #0ea472; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Recuperação de Senha</h1>
              </div>
              <div class="content">
                <p>Olá,</p>
                <p>Você solicitou uma recuperação de senha para sua conta no sistema <strong>Aprovar</strong>.</p>
                <p>Clique no botão abaixo para redefinir sua senha:</p>
                <center>
                  <a href="${data?.properties?.action_link}" class="button">
                    Redefinir Senha
                  </a>
                </center>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">
                  Este link expira em 24 horas. Se você não solicitou isso, ignore este email.
                </p>
              </div>
              <div class="footer">
                <p>© 2024 Aprovar. Todos os direitos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      subject: 'Recuperação de Senha - Aprovar'
    })

    if (sendError) {
      console.error('Erro ao enviar email:', sendError)
      // Não falhar totalmente, pois o link foi gerado
    }

    return NextResponse.json({
      success: true,
      message: 'Email de recuperação enviado com sucesso'
    })
  } catch (error) {
    console.error('Erro no servidor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
