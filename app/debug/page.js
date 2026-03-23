'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

export default function Debug() {
  const [status, setStatus] = useState([])

  useEffect(() => {
    const runChecks = async () => {
      const checks = []

      // Check 1: Variáveis de ambiente
      checks.push({
        name: 'Variáveis de Ambiente',
        status: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
        message: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'URL configurada' : 'URL FALTANDO',
        value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Não encontrada'
      })

      checks.push({
        name: 'Chave Anon',
        status: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌',
        message: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Chave configurada' : 'Chave FALTANDO',
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'Não encontrada'
      })

      // Check 2: Conexão ao Supabase
      try {
        const { data, error } = await supabase.auth.getSession()
        checks.push({
          name: 'Conexão Supabase',
          status: '✅',
          message: 'Supabase respondendo',
          value: 'OK'
        })
      } catch (err) {
        checks.push({
          name: 'Conexão Supabase',
          status: '❌',
          message: 'Erro ao conectar',
          value: err.message
        })
      }

      // Check 3: Auth Session
      try {
        const { data: { session } } = await supabase.auth.getSession()
        checks.push({
          name: 'Session',
          status: session ? '✅' : '⚠️',
          message: session ? 'Usuário logado' : 'Nenhum usuário logado',
          value: session?.user?.email || 'Não logado'
        })
      } catch (err) {
        checks.push({
          name: 'Session',
          status: '❌',
          message: 'Erro ao verificar',
          value: err.message
        })
      }

      setStatus(checks)
    }

    runChecks()
  }, [])

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1>🔧 Debug - Status do Sistema</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Esta página verifica se tudo está configurado corretamente
      </p>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        {status.length === 0 ? (
          <p>Verificando...</p>
        ) : (
          status.map((check, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '5px',
              borderLeft: '4px solid',
              borderLeftColor: check.status === '✅' ? '#28a745' : check.status === '⚠️' ? '#ffc107' : '#dc3545'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong>{check.status} {check.name}</strong>
                <span style={{ color: '#666', fontSize: '12px' }}>{check.message}</span>
              </div>
              <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '3px', fontSize: '12px', wordBreak: 'break-all' }}>
                {check.value}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#fffbeb', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
        <h3>⚠️ Se alguma verificação falhou:</h3>
        <ol>
          <li><strong>Variáveis de Ambiente:</strong> Crie/verifique arquivo `.env.local` na raiz</li>
          <li><strong>URL ou Chave:</strong> Verifique no Supabase > Settings > API</li>
          <li><strong>Banco de Dados:</strong> Execute `migrations.sql` no Supabase SQL Editor</li>
          <li><strong>Reinicie:</strong> Ctrl+C e `npm run dev` novamente</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#d4edda', borderRadius: '8px', borderLeft: '4px solid #28a745' }}>
        <h3>✅ Se tudo passou:</h3>
        <p>Vá para <a href="/login">http://localhost:3000/login</a> e crie uma conta!</p>
      </div>
    </div>
  )
}
