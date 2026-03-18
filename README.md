# AprovaAí — Next.js

Plataforma de aprovação de conteúdo migrada para **Next.js 15** com TypeScript, Tailwind CSS e Supabase.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ ou pnpm
- Conta Supabase ativa

### Instalação

```bash
# Clone ou extraia o projeto
cd aprovaai-next

# Instale as dependências
npm install
# ou
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Preencha com suas credenciais Supabase:
# NEXT_PUBLIC_SUPABASE_URL=https://seu-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### Desenvolvimento

```bash
npm run dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build para Produção

```bash
npm run build
npm start
# ou
pnpm build
pnpm start
```

## 📋 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Página inicial (redirecionamento)
│   ├── login/             # Página de login
│   ├── dashboard/         # Dashboard principal
│   ├── clients/           # Gerenciamento de clientes
│   ├── approvals/         # Aprovações de conteúdo
│   ├── schedule/          # Calendário de publicações
│   ├── team/              # Gerenciamento de equipe
│   ├── settings/          # Configurações de perfil
│   ├── integrations/      # Integrações
│   └── approve/           # Página pública de aprovação
├── components/
│   ├── layout/            # Componentes de layout
│   └── ui/                # Componentes reutilizáveis
├── contexts/              # Context API (Auth)
├── lib/                   # Utilitários (Supabase)
├── types/                 # Tipos TypeScript
├── styles/                # Estilos globais
└── hooks/                 # Custom hooks
```

## 🔐 Autenticação

A autenticação é gerenciada via **Supabase Auth** com Context API. O `AuthProvider` envolve toda a aplicação em `layout.tsx`.

### Usar autenticação em componentes:

```tsx
import { useAuth } from "@/contexts/AuthContext";

export function MyComponent() {
  const { user, profile, loading, signOut } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Não autenticado</div>;
  
  return <div>Bem-vindo, {profile?.full_name}!</div>;
}
```

## 🎨 Componentes UI

Componentes reutilizáveis em `src/components/ui/`:

- `Button` — Botão com variantes (primary, secondary, danger, ghost, outline)
- `Card` — Container com estilos
- `Modal` — Modal com overlay
- `FormField` — Campo de formulário com label e erro
- `StatusBadge` — Badge de status (pending, approved, rejected, revision)
- `EmptyState` — Estado vazio com ícone e ação

### Exemplo:

```tsx
import { Button, Card, FormField } from "@/components/ui";

export function Example() {
  return (
    <Card>
      <FormField label="Nome">
        <input placeholder="Digite seu nome" />
      </FormField>
      <Button>Salvar</Button>
    </Card>
  );
}
```

## 🗄️ Banco de Dados

Execute o schema SQL em `supabase_schema.sql` no SQL Editor do Supabase:

```bash
# Copie o conteúdo de supabase_schema.sql
# Acesse: https://app.supabase.com -> SQL Editor
# Cole e execute
```

## 📦 Dependências Principais

- **Next.js 15** — Framework React
- **TypeScript** — Tipagem estática
- **Tailwind CSS** — Estilos utilitários
- **Supabase** — Backend e autenticação
- **React Hot Toast** — Notificações
- **date-fns** — Manipulação de datas
- **lucide-react** — Ícones

## 🚢 Deploy

### Vercel (Recomendado)

1. Push do código para GitHub
2. Conecte o repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Node.js 18+:
- Netlify
- Railway
- Render
- Digital Ocean
- AWS Amplify

## 📝 Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key

# Opcional
NEXT_PUBLIC_TWILIO_ACCOUNT_SID=
NEXT_PUBLIC_TWILIO_AUTH_TOKEN=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🔄 Migração do React (CRA)

Este projeto foi migrado de Create React App para Next.js:

- ✅ Router: `react-router-dom` → Next.js App Router
- ✅ Estilos: CSS inline → Tailwind CSS
- ✅ Build: `react-scripts` → `next build`
- ✅ Servidor: SPA → SSR/SSG com Next.js

## 📚 Documentação

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 Licença

Propriedade privada — AprovaAí
