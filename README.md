# Aprovar — Clone React + Supabase + Vercel

Plataforma de aprovações e agendamento de postagens para agências e profissionais de marketing.

## Stack

- **Frontend**: React 18, React Router v6
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Deploy**: Vercel
- **UI**: CSS puro com design system customizado, Lucide React
- **Notificações**: react-hot-toast
- **Datas**: date-fns (pt-BR)

---

## Funcionalidades implementadas

| Fluxo | Página | Status |
|-------|--------|--------|
| Cadastro + Trial 7 dias | `/login` | ✅ |
| Gestão de clientes | `/clients` | ✅ |
| Aprovadores por cliente | `/clients` (modal) | ✅ |
| Envio de entregáveis | `/approvals` | ✅ |
| Link público de aprovação | `/approve/:token` | ✅ |
| Upload de arquivos | Supabase Storage | ✅ |
| Calendário de publicações | `/schedule` | ✅ |
| Gestão de equipe | `/team` | ✅ |
| Integrações externas | `/integrations` | ✅ |
| Planos + Billing | `/billing` | ✅ (Stripe a conectar) |
| Whitelabel (logo + cor) | `/settings` | ✅ |
| Row Level Security | Supabase | ✅ |

---

## Setup local

### 1. Clone e instale dependências

```bash
git clone https://github.com/seu-usuario/aprovaai.git
cd aprovaai
npm install
```

### 2. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No **SQL Editor**, cole e execute o conteúdo de `supabase_schema.sql`
3. Copie a **URL** e a **anon key** em *Project Settings → API*

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
REACT_APP_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=SUA_ANON_KEY
REACT_APP_BASE_URL=http://localhost:3000
```

### 3. Rode localmente

```bash
npm start
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Deploy na Vercel

### Opção A — Via GitHub (recomendado)

1. Faça push do projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**
3. Importe o repositório
4. Configure as variáveis de ambiente:

| Variável | Valor |
|----------|-------|
| `REACT_APP_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJ...` |
| `REACT_APP_BASE_URL` | `https://seu-dominio.vercel.app` |

5. Clique em **Deploy** — a Vercel detecta automaticamente o React

### Opção B — Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

> O arquivo `vercel.json` já está configurado para SPA (roteamento client-side).

---

## Supabase Auth — URLs permitidas

No Supabase, vá em **Authentication → URL Configuration** e adicione:

- **Site URL**: `https://seu-dominio.vercel.app`
- **Redirect URLs**: `https://seu-dominio.vercel.app/**`

---

## Integrar Stripe (Billing)

1. Crie um projeto no [stripe.com](https://stripe.com)
2. Crie uma **Supabase Edge Function**:

```bash
supabase functions new create-checkout
```

```typescript
// supabase/functions/create-checkout/index.ts
import Stripe from 'https://esm.sh/stripe@13'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)

Deno.serve(async (req) => {
  const { plan, cycle } = await req.json()
  const priceId = PRICE_IDS[plan][cycle] // configure seus Price IDs do Stripe
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${Deno.env.get('SITE_URL')}/billing?success=true`,
    cancel_url: `${Deno.env.get('SITE_URL')}/billing`,
  })
  
  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

3. Na página `/billing`, descomente a chamada à Edge Function.

---

## Estrutura do projeto

```
aprovaai/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/           # Button, Card, Modal, Badge...
│   │   └── layout/       # AppLayout (sidebar + topbar)
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── DashboardPage.js
│   │   ├── ClientsPage.js
│   │   ├── ApprovalsPage.js
│   │   ├── ApprovalPublicPage.js  # Rota pública /approve/:token
│   │   ├── SchedulePage.js
│   │   ├── TeamPage.js
│   │   ├── IntegrationsPage.js
│   │   ├── BillingPage.js
│   │   └── SettingsPage.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── supabase_schema.sql   # Execute no Supabase SQL Editor
├── vercel.json           # Rewrite rules para SPA
├── .env.example
└── package.json
```

---

## Checklist de produção

- [ ] Executar `supabase_schema.sql` no projeto Supabase
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Configurar URLs de autenticação no Supabase
- [ ] Conectar Stripe e implementar Edge Functions de billing
- [ ] Configurar domínio customizado na Vercel
- [ ] Configurar SMTP para e-mails transacionais (Supabase Auth → SMTP Settings)
- [ ] Ativar Supabase Realtime nas tabelas `deliverables` e `notifications` (para updates em tempo real)
