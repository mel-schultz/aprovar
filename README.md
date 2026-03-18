# eKyte Clone - Sistema de Gestão de Marketing Digital

Uma aplicação web completa para gerenciamento de equipes de marketing, projetos, tarefas e atendimento ao cliente. Inspirada no sistema eKyte, com suporte a múltiplos níveis de usuário (administrador, atendimento e designer).

## 🚀 Funcionalidades Principais

### Gestão de Projetos
- Criar, editar e deletar projetos
- Definir status (planejamento, produção, aprovação, publicado, arquivado)
- Controle de orçamento e prazos
- Associação com clientes

### Gestão de Tarefas
- Criar tarefas vinculadas a projetos
- Atribuição de tarefas a membros da equipe
- Priorização (baixa, média, alta, urgente)
- Acompanhamento de status (pendente, em progresso, revisão, concluída)
- Filtros por status e prioridade

### Atendimento ao Cliente
- Gerenciamento de tickets/solicitações
- Rastreamento de status de atendimento
- Associação com clientes
- Priorização de demandas

### Relatórios e Analytics
- Dashboard com métricas principais
- Gráficos de atividade mensal
- Distribuição de projetos por status
- Análise de tarefas por prioridade
- Exportação de dados (PDF e CSV)

### Controle de Acesso
- Três níveis de usuário: Admin, Atendimento, Designer
- Permissões específicas por perfil
- Row Level Security (RLS) no banco de dados

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Framework**: Next.js (estrutura base)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **UI Components**: shadcn/ui
- **Gráficos**: Recharts
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm
- Conta no Supabase
- Conta na Vercel (para deploy)

## 🔧 Configuração Local

### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd ekyte-clone
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_APP_NAME=eKyte Clone
VITE_APP_URL=http://localhost:5173
```

### 4. Configurar Supabase

1. Acesse [Supabase](https://supabase.com) e crie um novo projeto
2. Execute o script SQL em `supabase/init.sql` no editor SQL do Supabase
3. Configure a autenticação (Email/Password)
4. Copie a URL e a chave anônima para o arquivo `.env.local`

### 5. Executar localmente

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

## 👥 Credenciais de Demonstração

Para testar a aplicação, use as seguintes credenciais:

- **Email**: admin@ekyte.com
- **Senha**: demo123456
- **Perfil**: Administrador

## 📁 Estrutura do Projeto

```
ekyte-clone/
├── client/
│   ├── src/
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # Contextos React (Auth, Theme)
│   │   ├── lib/             # Utilitários e configurações
│   │   ├── App.tsx          # Roteamento principal
│   │   └── index.css        # Estilos globais
│   ├── public/              # Arquivos estáticos
│   └── index.html           # HTML principal
├── server/                  # Backend (placeholder)
├── supabase/
│   └── init.sql             # Script de inicialização do banco
├── package.json
└── README.md
```

## 🔐 Perfis de Usuário

### Administrador
- Acesso completo a todos os módulos
- Gerenciamento de usuários
- Configurações do sistema
- Visualização de relatórios completos

### Atendimento
- Gerenciamento de clientes e tickets
- Criação de projetos e tarefas
- Visualização de relatórios básicos
- Não pode gerenciar usuários

### Designer
- Visualização de tarefas atribuídas
- Submissão de trabalhos para aprovação
- Acesso a biblioteca de ativos
- Acesso limitado a outras funcionalidades

## 📊 Módulos Implementados

- ✅ Autenticação e controle de acesso
- ✅ Dashboard com métricas
- ✅ Gerenciamento de projetos
- ✅ Gerenciamento de tarefas
- ✅ Sistema de atendimento/tickets
- ✅ Relatórios e analytics
- ⏳ Biblioteca de ativos (em desenvolvimento)
- ⏳ Sistema de aprovação (em desenvolvimento)
- ⏳ Integrações com redes sociais (em desenvolvimento)

## 🚀 Deploy na Vercel

### 1. Preparar para deploy

```bash
pnpm build
```

### 2. Conectar ao Vercel

1. Acesse [Vercel](https://vercel.com)
2. Clique em "New Project"
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 3. Deploy

```bash
vercel
```

Ou faça push para a branch `main` do seu repositório para deploy automático.

## 🔗 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase | `eyJhbGc...` |
| `VITE_APP_NAME` | Nome da aplicação | `eKyte Clone` |
| `VITE_APP_URL` | URL da aplicação | `http://localhost:5173` |

## 📝 Próximos Passos

- [ ] Implementar biblioteca de ativos com upload de arquivos
- [ ] Sistema de aprovação com comentários e feedback
- [ ] Integração com redes sociais (Meta, Instagram)
- [ ] Notificações em tempo real
- [ ] Sistema de permissões mais granular
- [ ] Temas customizáveis
- [ ] Exportação de relatórios avançada
- [ ] API pública para integrações

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para support@ekyteclone.com ou abra uma issue no repositório.

## 🙏 Agradecimentos

- Inspirado no [eKyte](https://www.ekyte.com)
- Construído com [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com) e [Supabase](https://supabase.com)
- UI Components de [shadcn/ui](https://ui.shadcn.com)

---

**Desenvolvido com ❤️ para equipes de marketing**
