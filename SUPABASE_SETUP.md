# Guia de Configuração do Supabase

Este documento descreve como configurar o Supabase para a aplicação eKyte Clone.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Acesso ao painel de controle do Supabase

## 🚀 Passo 1: Criar um Projeto no Supabase

1. Acesse [Supabase](https://supabase.com) e faça login
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: `ekyte-clone` (ou seu nome preferido)
   - **Database Password**: Crie uma senha forte
   - **Region**: Selecione a região mais próxima
4. Clique em "Create new project"
5. Aguarde a criação (pode levar alguns minutos)

## 🔑 Passo 2: Obter Credenciais

1. No painel do Supabase, vá para **Settings** → **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: Chave anônima
3. Salve essas credenciais para usar no arquivo `.env.local`

## 🗄️ Passo 3: Configurar o Banco de Dados

### Opção A: Usar o Script SQL (Recomendado)

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase/init.sql`
4. Cole no editor SQL
5. Clique em "Run"
6. Aguarde a execução (você verá uma mensagem de sucesso)

### Opção B: Criar Tabelas Manualmente

Se preferir criar as tabelas manualmente, siga os passos em `supabase/init.sql` usando o SQL Editor.

## 🔐 Passo 4: Configurar Autenticação

### Habilitar Email/Password

1. Vá para **Authentication** → **Providers**
2. Certifique-se de que "Email" está habilitado
3. Vá para **Settings** → **Email Templates** e customize se necessário

### Criar Usuário Admin de Teste

1. Vá para **Authentication** → **Users**
2. Clique em "Add user"
3. Preencha:
   - **Email**: `admin@ekyte.com`
   - **Password**: `demo123456`
4. Clique em "Create user"

### Criar Perfil do Admin

1. Vá para **SQL Editor**
2. Execute a seguinte query:

```sql
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Admin User', 'admin'
FROM auth.users
WHERE email = 'admin@ekyte.com';
```

## 🛡️ Passo 5: Configurar Row Level Security (RLS)

O RLS já está configurado no script `init.sql`. Verifique se está ativado:

1. Vá para **Authentication** → **Policies**
2. Verifique se as políticas estão criadas para cada tabela
3. As políticas permitem:
   - Usuários visualizarem seus próprios dados
   - Admins visualizarem todos os dados
   - Usuários criarem e atualizarem seus próprios registros

## 📧 Passo 6: Configurar Email (Opcional)

Para enviar emails de confirmação e recuperação de senha:

1. Vá para **Authentication** → **Email Templates**
2. Customize os templates conforme necessário
3. Configure um provedor SMTP em **Settings** → **Email** se desejar usar seu próprio servidor

## 🔄 Passo 7: Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as variáveis:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_key_aqui
VITE_APP_NAME=eKyte Clone
VITE_APP_URL=http://localhost:5173
```

## 🧪 Passo 8: Testar a Configuração

1. Execute a aplicação localmente:
   ```bash
   pnpm dev
   ```

2. Acesse `http://localhost:5173`

3. Tente fazer login com:
   - Email: `admin@ekyte.com`
   - Senha: `demo123456`

4. Se conseguir acessar o dashboard, tudo está configurado corretamente!

## 📊 Verificar Dados no Supabase

Para verificar se os dados estão sendo salvos corretamente:

1. Vá para **Table Editor** no Supabase
2. Selecione cada tabela e verifique os dados:
   - `profiles`: Deve conter o usuário admin
   - `projects`: Projetos criados
   - `tasks`: Tarefas criadas
   - `tickets`: Tickets de atendimento

## 🔗 Estrutura de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Perfis de usuários com roles |
| `projects` | Projetos/campanhas de marketing |
| `tasks` | Tarefas dos projetos |
| `tickets` | Solicitações de atendimento |
| `clients` | Clientes |
| `assets` | Biblioteca de ativos (imagens, vídeos) |
| `approvals` | Fluxo de aprovação |
| `comments` | Comentários em tarefas e aprovações |
| `notifications` | Notificações do sistema |

## 🚨 Troubleshooting

### Erro: "Invalid API Key"
- Verifique se a chave no `.env.local` está correta
- Certifique-se de estar usando a chave **anon public**, não a chave de serviço

### Erro: "Row Level Security violation"
- Verifique se as políticas RLS estão criadas
- Certifique-se de estar autenticado antes de acessar dados protegidos

### Erro: "Table does not exist"
- Execute novamente o script `init.sql`
- Verifique se não houve erros durante a execução

### Usuário não consegue fazer login
- Verifique se o usuário foi criado em **Authentication** → **Users**
- Certifique-se de que o email e senha estão corretos
- Verifique se o perfil foi criado na tabela `profiles`

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## 🔐 Segurança

Lembre-se de:

1. **Nunca** compartilhe sua chave de serviço
2. Use apenas a chave **anon public** no frontend
3. Sempre use HTTPS em produção
4. Mantenha as políticas RLS ativas
5. Revise regularmente as permissões de usuários

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação do Supabase
2. Consulte os logs em **Logs** → **API Logs**
3. Abra uma issue no repositório do projeto
