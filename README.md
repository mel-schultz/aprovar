# Aprovar — Next.js 14 + Supabase + Vercel

Plataforma de aprovações e agendamento de postagens para agências.

## Setup em 3 passos

### 1. Banco de dados — execute `supabase_schema.sql` no Supabase SQL Editor

Este arquivo único cria todas as tabelas, RLS, triggers, storage e define `mel.schultz@yahoo.com` como admin.

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon/public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role ⚠️ nunca expor |
| `NEXT_PUBLIC_BASE_URL` | URL do seu projeto (ex: `https://aprovar.vercel.app`) |

**Na Vercel:** adicione as mesmas 4 variáveis em Project → Settings → Environment Variables.

### 3. Rodar

```bash
npm install && npm run dev
# http://localhost:3000
```

---

## Níveis de acesso

| Role | Destino pós-login | Acesso |
|---|---|---|
| `admin` | `/dashboard` | Todas as telas |
| `client` | `/portal` | Apenas o portal de aprovação |

A tela `/users` é exclusiva de admins e gerencia:
- **Usuários do sistema** — criar, editar, ativar/desativar, excluir
- **Clientes da plataforma** — empresas/marcas com seus aprovadores
- **Aprovadores** — visão global de todos os aprovadores

---

## Deploy na Vercel

1. Push do código para GitHub
2. Importe o repositório na Vercel
3. Adicione as 4 variáveis de ambiente
4. Deploy automático — Next.js é detectado sem configuração extra

**Supabase Auth URLs** (Authentication → URL Configuration):
- Site URL: `https://seu-projeto.vercel.app`
- Redirect URLs: `https://seu-projeto.vercel.app/**`

---

## Estrutura

```
app/
├── login/          Login + cadastro
├── dashboard/      Dashboard admin (métricas, entregáveis recentes)
├── clients/        Clientes da agência
├── approvals/      Entregáveis + upload + link de aprovação
├── approve/[token] Aprovação pública sem login
├── schedule/       Calendário de publicações
├── team/           Membros da equipe
├── integrations/   Google Drive, Canva, Zapier, redes sociais
├── settings/       Whitelabel + senha
├── users/          ⭐ Gerenciar usuários, clientes e aprovadores (admin only)
└── portal/         Portal do cliente (role: client)

lib/supabase/
├── client.js       Browser client
├── server.js       Server client (SSR)
├── admin.js        Admin client (service_role — só em API Routes)
└── getOrCreateProfile.js  Busca/cria perfil no primeiro acesso
```

---

## 🔧 Correção: "Could not find a relationship in the schema cache"

Se aparecer o erro `Could not find a relationship between 'clients' and 'approvers' in the schema cache`, siga estes passos:

### Passo 1 — Execute o SQL de correção no Supabase

No **SQL Editor** do Supabase Dashboard, execute o bloco de correção que está no final do arquivo `supabase_schema.sql`:

```sql
-- Recriar FKs para o PostgREST reconhecer os relacionamentos
ALTER TABLE public.approvers
  DROP CONSTRAINT IF EXISTS approvers_client_id_fkey;
ALTER TABLE public.approvers
  ADD CONSTRAINT approvers_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.deliverables
  DROP CONSTRAINT IF EXISTS deliverables_client_id_fkey;
ALTER TABLE public.deliverables
  ADD CONSTRAINT deliverables_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Forçar reload do schema cache
NOTIFY pgrst, 'reload schema';
```

### Passo 2 — Se o erro persistir

O código já inclui **fallback automático**: todas as queries que usam a sintaxe embedded `tabela(campo)` tentam primeiro via PostgREST e, se falharem, fazem queries separadas e montam o mesmo resultado. Isso está centralizado em `lib/supabase/queries.js`.

### Causa raiz

O PostgREST (camada de API do Supabase) constrói um **schema cache** com base nas foreign keys do banco. Se o schema SQL foi executado em partes ou com erros silenciosos, algumas FKs podem não ter sido criadas, fazendo com que o PostgREST não consiga resolver os relacionamentos embedded.
