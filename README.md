# Aprovar — Next.js 14 + Supabase + Vercel

Plataforma de aprovações e agendamento de postagens para agências e profissionais de marketing.
**Todas as funcionalidades estão disponíveis sem restrição de plano.**

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Banco de dados | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Auth SSR | `@supabase/ssr` com cookies |
| Deploy | Vercel |
| Tipografia | Google Sans (Display, Text, Mono) |
| Ícones | Lucide React |
| Notificações | react-hot-toast |
| Datas | date-fns (pt-BR) |

---

## Funcionalidades

| Rota | Funcionalidade |
|------|---------------|
| `/login` | Login + cadastro |
| `/dashboard` | Métricas em tempo real |
| `/clients` | CRUD de clientes + aprovadores ilimitados |
| `/approvals` | Entregáveis + upload Supabase Storage + link único |
| `/approve/[token]` | Aprovação pública sem login |
| `/schedule` | Calendário mensal de publicações |
| `/team` | Equipe com membros ilimitados |
| `/integrations` | Google Drive, Canva, Zapier, redes sociais |
| `/settings` | Whitelabel (logo + cor da marca) + senha |

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
2. Vá em **SQL Editor** e execute o conteúdo de `supabase_schema.sql`
3. Copie **URL** e **anon key** em *Project Settings → API*

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 3. Rodar localmente

```bash
npm run dev
# Acesse http://localhost:3000
```

---

## Deploy na Vercel

1. Push do projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) → **Add New Project** → importe o repositório
3. Adicione as variáveis de ambiente:

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
| `NEXT_PUBLIC_BASE_URL` | `https://seu-projeto.vercel.app` |

4. Clique em **Deploy** — a Vercel detecta Next.js automaticamente

### Supabase Auth — URLs permitidas

Em **Authentication → URL Configuration**, adicione:
- **Site URL**: `https://seu-projeto.vercel.app`
- **Redirect URLs**: `https://seu-projeto.vercel.app/**`

---

## Estrutura do projeto

```
aprovar/
├── app/
│   ├── globals.css              # Google Sans + design tokens
│   ├── layout.js                # Root layout + Toaster
│   ├── page.js                  # → redirect /dashboard
│   ├── error.js                 # Error boundary global
│   ├── loading.js               # Loading spinner global
│   ├── not-found.js             # Página 404
│   ├── login/page.js
│   ├── dashboard/               # Server + DashboardClient
│   ├── clients/                 # Server + ClientsClient
│   ├── approvals/               # Server + ApprovalsClient
│   ├── approve/[token]/         # Server + ApproveClient (público)
│   ├── schedule/                # Server + ScheduleClient
│   ├── team/                    # Server + TeamClient
│   ├── integrations/            # Server + IntegrationsClient
│   ├── settings/                # Server + SettingsClient
│   └── api/auth/callback/       # OAuth callback handler
├── components/
│   ├── ui/
│   │   ├── index.js             # Button, Card, Modal, FormField, Badge, EmptyState
│   │   ├── Skeleton.js          # Loading skeletons
│   │   └── Toast.js             # Helpers de notificação
│   └── layout/AppLayout.js      # Sidebar + Topbar
├── hooks/
│   ├── useProfile.js            # Perfil do usuário autenticado
│   └── useDeliverables.js       # CRUD + Realtime de entregáveis
├── lib/
│   ├── supabase/
│   │   ├── client.js            # Browser client
│   │   └── server.js            # Server client (cookies SSR)
│   └── utils.js                 # Helpers, formatadores, constantes
├── types/index.js               # JSDoc types para editor
├── middleware.js                 # Proteção de rotas no edge
├── jsconfig.json                # Path aliases @/components, @/lib...
├── supabase_schema.sql           # Schema completo — execute no Supabase
├── next.config.js
├── vercel.json
└── .env.example
```

---

## Checklist de produção

- [ ] Executar `supabase_schema.sql` no Supabase SQL Editor
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Adicionar URLs de redirecionamento no Supabase Auth
- [ ] Configurar SMTP em *Supabase → Auth → SMTP Settings*
- [ ] Habilitar Realtime em *Supabase → Database → Replication* para a tabela `deliverables`
- [ ] Configurar domínio customizado na Vercel
