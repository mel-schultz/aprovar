# Guia de Uso - eKyte Clone

Bem-vindo ao eKyte Clone! Este documento descreve como usar a aplicação para gerenciar seus projetos de marketing digital.

## 🚀 Começando

### 1. Fazer Login

1. Acesse a aplicação em `http://localhost:5173` (desenvolvimento) ou sua URL de produção
2. Você será redirecionado para a página de login
3. Use as credenciais:
   - **Email**: `admin@ekyte.com`
   - **Senha**: `demo123456`
4. Clique em "Entrar"

### 2. Explorar o Dashboard

Após fazer login, você será levado ao Dashboard, que mostra:

- **Métricas principais**: Total de projetos, tarefas, equipe e performance
- **Gráficos de atividade**: Visualização de projetos e tarefas por mês
- **Performance semanal**: Taxa de conclusão de tarefas
- **Atividade recente**: Últimas ações no sistema

## 📁 Módulos Principais

### 1. Projetos

O módulo de Projetos permite gerenciar campanhas e projetos de marketing.

#### Criar um Novo Projeto

1. Clique em "Projetos" no menu lateral
2. Clique em "Novo Projeto"
3. Preencha os dados:
   - **Nome do Projeto**: Nome descritivo (ex: "Campanha de Verão")
   - **Descrição**: Detalhes do projeto
   - **Status**: Selecione o status inicial (Planejamento, Produção, Aprovação, Publicado, Arquivado)
   - **Orçamento**: Valor alocado (opcional)
   - **Prazo**: Data de conclusão (opcional)
4. Clique em "Criar Projeto"

#### Editar um Projeto

1. Clique no botão "Editar" no projeto desejado
2. Faça as alterações necessárias
3. Clique em "Atualizar Projeto"

#### Deletar um Projeto

1. Clique no botão "Deletar" no projeto
2. Confirme a exclusão

### 2. Tarefas

O módulo de Tarefas permite criar e acompanhar atividades vinculadas aos projetos.

#### Criar uma Nova Tarefa

1. Clique em "Tarefas" no menu lateral
2. Clique em "Nova Tarefa"
3. Preencha os dados:
   - **Título**: Nome da tarefa
   - **Descrição**: Detalhes da tarefa
   - **Projeto**: Selecione o projeto associado
   - **Status**: Pendente, Em Progresso, Revisão ou Concluída
   - **Prioridade**: Baixa, Média, Alta ou Urgente
   - **Prazo**: Data de conclusão (opcional)
4. Clique em "Criar Tarefa"

#### Marcar Tarefa como Concluída

1. Na lista de tarefas, clique no ícone de círculo ao lado da tarefa
2. O ícone mudará para um círculo preenchido (✓)
3. O status da tarefa será atualizado para "Concluída"

#### Filtrar Tarefas

1. Use os filtros na parte superior:
   - **Status**: Filtre por status específico
   - **Prioridade**: Filtre por nível de prioridade
2. Selecione as opções desejadas para filtrar a lista

### 3. Atendimento

O módulo de Atendimento gerencia solicitações e tickets de clientes.

#### Criar um Novo Ticket

1. Clique em "Atendimento" no menu lateral
2. Clique em "Novo Ticket"
3. Preencha os dados:
   - **Título**: Assunto do ticket
   - **Descrição**: Detalhes do problema ou solicitação
   - **Nome do Cliente**: Nome da pessoa que fez a solicitação
   - **Email do Cliente**: Email de contato
   - **Status**: Aberto, Em Atendimento, Resolvido ou Fechado
   - **Prioridade**: Baixa, Média, Alta ou Urgente
4. Clique em "Criar Ticket"

#### Responder a um Ticket

1. Clique no ícone de mensagem (💬) no ticket
2. Adicione sua resposta
3. Clique em "Enviar"

#### Atualizar Status do Ticket

1. Clique em "Editar" no ticket
2. Altere o status conforme necessário
3. Clique em "Atualizar Ticket"

### 4. Relatórios

O módulo de Relatórios fornece análises e visualizações de dados.

#### Visualizar Relatórios

1. Clique em "Relatórios" no menu lateral
2. Você verá:
   - **Cartões de resumo**: Total de projetos, tarefas, tarefas concluídas e taxa de conclusão
   - **Gráficos**: Projetos por status, tarefas por prioridade, tarefas por status, atividade mensal

#### Exportar Dados

1. Clique em "Exportar PDF" ou "Exportar CSV" (funcionalidade em desenvolvimento)
2. O arquivo será baixado automaticamente

### 5. Usuários (Admin Only)

O módulo de Usuários permite gerenciar membros da equipe (apenas para administradores).

#### Criar um Novo Usuário

1. Clique em "Usuários" no menu lateral
2. Clique em "Novo Usuário"
3. Preencha os dados:
   - **Nome Completo**: Nome do usuário
   - **Perfil**: Administrador, Atendimento ou Designer
4. Clique em "Criar Usuário"

#### Editar um Usuário

1. Clique em "Editar" no usuário desejado
2. Faça as alterações
3. Clique em "Atualizar Usuário"

#### Deletar um Usuário

1. Clique em "Deletar" no usuário
2. Confirme a exclusão

### 6. Configurações

O módulo de Configurações permite personalizar suas preferências.

#### Aba Perfil

Visualize suas informações de perfil:
- Nome completo
- Email
- Perfil/Role
- Data de cadastro

#### Aba Segurança

- **Alterar Senha**: Atualize sua senha
- **Sessão**: Veja suas sessões ativas e faça logout

#### Aba Notificações

Configure suas preferências de notificações:
- Notificações por email
- Tarefas atribuídas
- Tarefas concluídas
- Comentários

#### Aba Sistema (Admin Only)

Gerencie configurações globais da aplicação:
- Nome da aplicação
- Versão
- Ambiente
- Ações do sistema

## 👥 Perfis de Usuário

### Administrador

O perfil de administrador tem acesso completo a todos os módulos:

- ✅ Dashboard
- ✅ Projetos (criar, editar, deletar)
- ✅ Tarefas (criar, editar, deletar)
- ✅ Atendimento (criar, editar, deletar)
- ✅ Relatórios (visualizar, exportar)
- ✅ Usuários (criar, editar, deletar)
- ✅ Configurações (todas as abas)

### Atendimento

O perfil de atendimento tem acesso aos módulos principais:

- ✅ Dashboard
- ✅ Projetos (criar, editar, deletar)
- ✅ Tarefas (criar, editar, deletar)
- ✅ Atendimento (criar, editar, deletar)
- ✅ Relatórios (visualizar, exportar)
- ❌ Usuários (sem acesso)
- ✅ Configurações (sem aba Sistema)

### Designer

O perfil de designer tem acesso limitado:

- ✅ Dashboard
- ✅ Projetos (visualizar)
- ✅ Tarefas (visualizar, editar tarefas atribuídas)
- ❌ Atendimento (sem acesso)
- ❌ Relatórios (sem acesso)
- ❌ Usuários (sem acesso)
- ✅ Configurações (apenas Perfil e Segurança)

## 🎨 Interface e Navegação

### Sidebar

A barra lateral esquerda contém:

- **Logo**: Clique para voltar ao dashboard
- **Menu de Navegação**: Acesse os diferentes módulos
- **Perfil do Usuário**: Veja seu nome e perfil
- **Botão Sair**: Faça logout

### Barra Superior

A barra superior contém:

- **Título da Página**: Mostra o módulo atual
- **Ícone de Notificações**: Veja notificações (em desenvolvimento)

### Atalhos de Teclado

- **Ctrl/Cmd + K**: Abrir paleta de comandos (em desenvolvimento)
- **Ctrl/Cmd + Shift + L**: Fazer logout

## 🔍 Dicas e Truques

### 1. Filtros Avançados

Use os filtros para encontrar rapidamente o que procura:

- Filtre tarefas por status e prioridade
- Filtre tickets por status
- Use a barra de busca (em desenvolvimento)

### 2. Atalhos de Status

- Clique no ícone de círculo para marcar tarefas como concluídas
- Use os badges de status para visualizar rapidamente o estado

### 3. Priorização

- Use a prioridade "Urgente" para tarefas críticas
- Use a prioridade "Baixa" para tarefas que podem esperar

### 4. Organização de Projetos

- Use nomes descritivos para projetos
- Adicione descrições detalhadas
- Defina prazos realistas

## 🐛 Troubleshooting

### Erro: "Acesso negado"

- Verifique se você tem permissão para acessar este módulo
- Consulte seu administrador para aumentar suas permissões

### Erro: "Falha ao carregar dados"

- Verifique sua conexão com a internet
- Atualize a página (F5)
- Tente novamente em alguns minutos

### Erro: "Sessão expirada"

- Faça login novamente
- Suas alterações foram salvas antes da expiração

### A aplicação está lenta

- Limpe o cache do navegador
- Feche abas desnecessárias
- Tente em outro navegador

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Consulte este guia
2. Verifique o README.md
3. Abra uma issue no repositório
4. Entre em contato com o suporte

## 🎓 Próximas Etapas

Após dominar os módulos básicos, explore:

1. **Biblioteca de Ativos**: Organize imagens, vídeos e documentos
2. **Sistema de Aprovação**: Configure fluxos de aprovação para tarefas
3. **Integrações**: Conecte com redes sociais e outras plataformas
4. **Automação**: Configure automações para tarefas repetitivas

## 📚 Recursos Adicionais

- [README.md](./README.md) - Informações técnicas do projeto
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuração do banco de dados
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Deploy na Vercel

---

**Desenvolvido com ❤️ para equipes de marketing**

Versão: 1.0.0 | Última atualização: 2026-03-18
