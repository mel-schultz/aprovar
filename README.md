# Aprovar — Next.js 14 + Supabase + Vercel

Plataforma de aprovações e agendamento de postagens para agências e profissionais de marketing.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Banco de dados | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Auth SSR | `@supabase/ssr` com cookies (Server + Client Components) |
| Deploy | Vercel |
| Tipografia | Google Sans (Display, Text, Mono) |
| Ícones | Lucide React |
| Notificações | react-hot-toast |
| Datas | date-fns (pt-BR) |

---

## Páginas implementadas

| Rota | Tipo | Funcionalidade |
|------|------|---------------|
| `/login` | Client | Login + cadastro com trial 7 dias |
| `/dashboard` | Server + Client | Métricas + entregáveis recentes |
| `/clients` | Server + Client | CRUD de clientes + aprovadores |
| `/approvals` | Server + Client | Entregáveis + upload + link único |
| `/approve/[token]` | Server + Client | Aprovação pública sem login |
| `/schedule` | Server + Client | Calendário mensal de publicações |
| `/team` | Server + Client | Gestão de equipe por plano |
| `/integrations` | Server + Client | Drive, Canva, Zapier, redes sociais |
| `/billing` | Server + Client | Planos + ciclo de cobrança |
| `/settings` | Server + Client | Whitelabel + senha |

---

## Setup local

### 1. Instalar dependências

```bash
git clone https://github.com/seu-usuario/aprovar.git
cd aprovar
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e cole + execute o conteúdo de `supabase_schema.sql`
3. Copie **URL** e **anon key** em *Project Settings → API*

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Deploy na Vercel

### Via GitHub (recomendado)

1. Push para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) → **Add New Project** → importe o repositório
3. A Vercel detecta Next.js automaticamente
4. Adicione as variáveis de ambiente:

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
| `NEXT_PUBLIC_BASE_URL` | `https://seu-projeto.vercel.app` |

5. Clique em **Deploy**

### Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Supabase Auth — URLs permitidas

Em **Authentication → URL Configuration**, adicione:

- **Site URL**: `https://seu-projeto.vercel.app`
- **Redirect URLs**: `https://seu-projeto.vercel.app/**`

---

## Diferenças em relação à versão React (CRA)

| Aspecto | React (CRA) | Next.js 14 (App Router) |
|---------|-------------|------------------------|
| Roteamento | React Router DOM | App Router nativo |
| Auth guard | `useAuth` hook client-side | `middleware.js` server-side |
| Data fetching | `useEffect` + Supabase client | Server Components + `@supabase/ssr` |
| SEO | SPA (sem SSR) | Metadata API por página |
| Deploy | `vercel.json` com rewrites | Detecção automática |
| Proteção de rotas | Redirect no browser | Redirect no edge (middleware) |

---

## Estrutura do projeto

```
aprovar/
├── app/
│   ├── globals.css
│   ├── layout.js              # Root layout + Toaster
│   ├── page.js                # Redirect → /dashboard
│   ├── login/page.js
│   ├── dashboard/
│   │   ├── page.js            # Server Component
│   │   └── DashboardClient.js
│   ├── clients/
│   │   ├── page.js
│   │   └── ClientsClient.js
│   ├── approvals/
│   │   ├── page.js
│   │   └── ApprovalsClient.js
│   ├── approve/[token]/
│   │   ├── page.js            # Server — busca dados
│   │   └── ApproveClient.js   # Client — interação
│   ├── schedule/
│   ├── team/
│   ├── integrations/
│   ├── billing/
│   └── settings/
├── components/
│   ├── ui/index.js            # Button, Card, Modal, Badge...
│   └── layout/AppLayout.js    # Sidebar + Topbar
├── lib/supabase/
│   ├── client.js              # Browser client
│   └── server.js              # Server client (cookies)
├── middleware.js              # Proteção de rotas no edge
├── supabase_schema.sql
├── next.config.js
├── vercel.json
└── .env.example
```

---

## Checklist de produção

- [ ] Executar `supabase_schema.sql` no Supabase
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Configurar URLs de autenticação no Supabase
- [ ] Configurar SMTP para e-mails transacionais (*Supabase → Auth → SMTP*)
- [ ] Integrar Stripe via Supabase Edge Functions para billing real
- [ ] Habilitar Realtime no Supabase para `deliverables` (atualizações ao vivo)
- [ ] Configurar domínio customizado na Vercel
