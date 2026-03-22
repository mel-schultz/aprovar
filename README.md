# 🎯 AprovaAí - Sistema de Gerenciamento de Aprovações

Sistema completo de gerenciamento de aprovações de entregáveis, baseado em "AprovaAí".

## 🚀 Funcionalidades

- ✅ **Autenticação** - Login e cadastro com Supabase
- ✅ **Gerenciamento de Usuários** - Admin, Atendimento e Cliente
- ✅ **Cadastro de Clientes** - White label completo
- ✅ **Entregáveis** - Upload e gerenciamento de arquivos
- ✅ **Calendário** - Tipo Google Agenda integrado
- ✅ **Aprovações** - Workflow de aprovações com comentários

## 📋 Requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

## 🔧 Setup Rápido

### 1. Clonar e instalar
```bash
npm install --legacy-peer-deps
```

### 2. Configurar Supabase
- Acesse https://supabase.com
- Crie novo projeto
- Copie URL e chave anon
- Crie arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Executar migrações
- No Supabase, vá para SQL Editor
- Cole o conteúdo de `migrations.sql`
- Execute (Ctrl+Enter)

### 4. Iniciar desenvolvimento
```bash
npm run dev
```

Acesse http://localhost:3000

## 📁 Estrutura

```
projeto/
├── app/
│   ├── login/          - Login e cadastro
│   ├── dashboard/      - Painel principal
│   ├── clientes/       - Gerenciar clientes
│   ├── entregaveis/    - Gerenciar entregáveis
│   ├── calendario/     - Calendário de eventos
│   ├── aprovacoes/     - Revisar e aprovar
│   ├── admin/          - Gerenciar usuários
│   └── api/            - API routes
├── lib/
│   └── supabase-client.js
├── migrations.sql      - SQL do banco
└── README.md          - Este arquivo
```

## 👥 Perfis de Usuário

1. **Admin** (👑)
   - Acesso total
   - Gerenciar usuários
   - Ver todos os entregáveis

2. **Atendimento** (💬)
   - Gerenciar clientes
   - Criar entregáveis
   - Revisar aprovações

3. **Cliente** (👤)
   - Visualizar próprios entregáveis
   - Enviar aprovações
   - Ver calendário

## 🔐 Segurança

- Auth via Supabase (JWT)
- Row Level Security (RLS) habilitado
- Validação de emails
- Senhas criptografadas

## 📦 Deploy

### Vercel (Recomendado)
1. Push para GitHub
2. Conectar repo no Vercel
3. Adicionar env vars
4. Deploy automático

### Outro host
```bash
npm run build
npm start
```

## 🆘 Troubleshooting

**"Credenciais do Supabase não encontradas"**
- Verifique `.env.local`
- Reinicie servidor (`npm run dev`)

**"Erro ao fazer login"**
- Confirme email no Supabase
- Verifique RLS policies

**"Calendário não funciona"**
- Verifique se `date-fns` está instalado
- Limpe cache: `rm -rf .next`

## 📞 Suporte

Para dúvidas, verifique a documentação do Supabase:
https://supabase.com/docs

## 📝 Licença

MIT
