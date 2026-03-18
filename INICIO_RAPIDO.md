# Início Rápido - eKyte Clone

Bem-vindo ao eKyte Clone! Este documento fornece um guia rápido para começar a usar a aplicação.

## 🚀 Primeiros Passos (5 minutos)

### 1. Instalação Local

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd ekyte-clone

# Instalar dependências
pnpm install

# Criar arquivo .env.local
cp .env.example .env.local

# Editar .env.local com suas credenciais do Supabase
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=sua_chave_aqui

# Iniciar servidor de desenvolvimento
pnpm dev
```

### 2. Acessar a Aplicação

Abra seu navegador em `http://localhost:5173` e faça login com:

- **Email**: `admin@ekyte.com`
- **Senha**: `demo123456`

### 3. Explorar o Dashboard

Você será levado ao Dashboard, que mostra:

- Métricas principais do sistema
- Gráficos de atividade
- Performance semanal
- Atividade recente

## 📁 Estrutura do Projeto

A aplicação está organizada em módulos principais:

| Módulo | Descrição | Acesso |
|--------|-----------|--------|
| Dashboard | Visão geral do sistema | Todos |
| Projetos | Gerenciar campanhas | Admin, Atendimento |
| Tarefas | Criar e acompanhar tarefas | Todos |
| Calendário | Visualizar prazos | Todos |
| Atendimento | Gerenciar tickets | Admin, Atendimento |
| Relatórios | Análises e gráficos | Admin, Atendimento |
| Usuários | Gerenciar equipe | Admin |
| Configurações | Preferências pessoais | Todos |

## 👥 Perfis de Usuário

A aplicação suporta três níveis de acesso:

**Administrador**: Acesso completo a todos os módulos, gerenciamento de usuários e configurações do sistema.

**Atendimento**: Acesso aos módulos principais, criação de projetos e tarefas, visualização de relatórios.

**Designer**: Acesso limitado, visualização de tarefas atribuídas e edição de trabalhos.

## 🔧 Configuração do Supabase

Para configurar o banco de dados:

1. Acesse [Supabase](https://supabase.com) e crie um novo projeto
2. Copie a URL e a chave anônima para o arquivo `.env.local`
3. Execute o script `supabase/init.sql` no editor SQL do Supabase
4. Crie um usuário de teste em **Authentication → Users**
5. Crie o perfil do usuário executando a query SQL fornecida

Consulte [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instruções detalhadas.

## 🚀 Deploy na Vercel

Para fazer deploy em produção:

1. Faça push do código para GitHub
2. Acesse [Vercel](https://vercel.com) e importe o repositório
3. Configure as variáveis de ambiente
4. Clique em "Deploy"

Consulte [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) para instruções completas.

## 📚 Documentação

- **[README.md](./README.md)**: Informações técnicas e stack
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**: Configuração do banco de dados
- **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)**: Deploy em produção
- **[GUIA_USO.md](./GUIA_USO.md)**: Guia completo de uso
- **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)**: Checklist de deploy

## 🎯 Próximas Ações

Após a instalação inicial, recomendamos:

1. **Explorar os módulos**: Navegue por Dashboard, Projetos, Tarefas e Relatórios
2. **Criar dados de teste**: Crie alguns projetos e tarefas para familiarizar-se
3. **Testar permissões**: Crie usuários com diferentes perfis e teste o acesso
4. **Configurar Supabase**: Personalize as configurações conforme necessário
5. **Preparar para deploy**: Siga o checklist de deploy quando estiver pronto

## 🐛 Troubleshooting

### Erro: "Cannot find module"

Execute `pnpm install` para instalar as dependências.

### Erro: "Invalid API Key"

Verifique se as variáveis de ambiente estão corretas no arquivo `.env.local`.

### Erro: "Row Level Security violation"

Certifique-se de que o script `init.sql` foi executado e que as políticas RLS estão ativas.

### Aplicação não carrega

Verifique o console do navegador (F12) para erros e consulte os logs do servidor.

## 💡 Dicas Úteis

- Use a paleta de comandos (Ctrl/Cmd + K) para navegação rápida
- Filtre tarefas por status e prioridade para melhor organização
- Configure notificações nas Configurações para não perder atualizações
- Exporte relatórios regularmente para acompanhamento
- Mantenha a documentação atualizada conforme o projeto evolui

## 📞 Suporte

Se encontrar problemas:

1. Consulte a documentação relevante
2. Verifique os logs do navegador (F12)
3. Consulte os logs do servidor
4. Abra uma issue no repositório
5. Entre em contato com o suporte

## 🎉 Parabéns!

Você está pronto para começar a usar o eKyte Clone! Explore a aplicação, crie seus primeiros projetos e tarefas, e aproveite o sistema de gerenciamento de marketing digital.

---

**Desenvolvido com ❤️ para equipes de marketing**

Versão: 1.0.0 | Última atualização: 2026-03-18
