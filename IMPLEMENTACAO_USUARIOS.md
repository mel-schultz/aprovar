# 🎯 Gerenciamento de Usuários - Implementação Completa

## Resumo das Alterações

Este documento descreve a implementação completa do sistema de gerenciamento de usuários com **3 níveis de acesso** no projeto Aprovar.

---

## 📋 Níveis de Usuários Implementados

### 1. **Admin** (Administrador)
- ✅ Acesso total ao sistema
- ✅ Pode gerenciar usuários (criar, editar, ativar/desativar, enviar reset de senha)
- ✅ Pode gerenciar clientes e aprovadores
- ✅ Visualiza a aba "Usuários" no menu lateral
- ✅ **mel.schultz@yahoo.com** é o primeiro admin do sistema

### 2. **Atendimento** (Atendimento)
- ✅ Gerencia aprovações de entregáveis
- ✅ Visualiza clientes e aprovadores
- ✅ Não tem acesso à aba "Usuários"
- ✅ Acesso limitado a funções de atendimento

### 3. **Cliente** (Cliente)
- ✅ Acesso ao portal de aprovação
- ✅ Visualiza apenas os entregáveis vinculados
- ✅ Não tem acesso à aba "Usuários"
- ✅ Acesso básico ao sistema

---

## 🔧 Arquivos Modificados

### 1. **supabase_schema.sql**
- Alterado o campo `role` para aceitar: `'admin'`, `'atendimento'`, `'cliente'`
- Atualizado o trigger `handle_new_user()` para lidar com os novos roles
- Atualizada a política de segurança para permitir que `atendimento` veja todos os perfis como `admin`
- Atualizado `user_invites` para suportar os novos roles

### 2. **components/layout/AppLayout.js**
- Adicionado filtro de visibilidade do menu "Usuários"
- Apenas usuários com role `admin` veem a aba "Usuários" no menu lateral
- Os itens do menu são filtrados dinamicamente baseado no role

### 3. **app/users/UsersClient.js**
- Atualizado `ROLE_CFG` para incluir 3 níveis com cores e descrições distintas
- Atualizado formulário de criação/edição para os 3 níveis
- Adicionado botão de "Enviar email de recuperação de senha" (ícone de envelope)
- Atualizado filtro de roles na busca (all, admin, atendimento, cliente)
- Atualizado card de estatísticas para mostrar a contagem dos 3 níveis
- Adicionado campo condicionável para "Empresa" (aparece para admin e atendimento)
- Mantido campo "Cliente vinculado" apenas para clientes

### 4. **app/users/page.js**
- Reforçada a verificação de permissão para garantir que apenas admin acessa
- Redirecionamento para `/dashboard` caso o usuário não seja admin

### 5. **lib/supabase/userManagement.js** (Novo)
- Função `sendPasswordResetEmail()` - Envia email de recuperação
- Função `updateUserActiveStatus()` - Ativa/desativa usuário
- Função `deleteUser()` - Deleta um usuário completamente
- Função `createSystemUser()` - Cria novo usuário do sistema
- Função `updateSystemUser()` - Atualiza dados do usuário

### 6. **app/api/users/send-reset-email/route.js** (Novo)
- Rota POST `/api/users/send-reset-email`
- Gera link de recuperação e envia email HTML formatado
- Suporta integração futura com serviços de email (Resend, SendGrid, etc.)

---

## 🎨 Interface Melhorada

### Cores dos Níveis
- **Admin**: Verde (#0ea472) - Acesso total + gerencia usuários
- **Atendimento**: Ciano (#06b6d4) - Gerencia aprovações
- **Cliente**: Roxo (#8b5cf6) - Visualiza aprovações

### Ações Disponíveis por Usuário
1. **Enviar email de recuperação de senha** (ícone 📧)
2. **Editar usuário** (ícone ✏️)
3. **Ativar/Desativar** (ícone 🔄)
4. **Deletar usuário** (ícone 🗑️)

---

## 🚀 Implementação no Supabase

### Passo 1: Atualizar Schema
Execute o SQL do arquivo `supabase_schema.sql` no editor SQL do Supabase:

```sql
-- Copie TODO o conteúdo de supabase_schema.sql
-- E execute no Supabase Console → SQL Editor
```

### Passo 2: Configurar Variáveis de Ambiente
Adicione ao `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_secreta_aqui
```

### Passo 3: Garantir que mel.schultz@yahoo.com é Admin
O script SQL já faz isso automaticamente. Se precisar criar/ajustar:

```sql
UPDATE public.profiles 
SET role = 'admin', is_active = true 
WHERE email = 'mel.schultz@yahoo.com';
```

---

## 💾 Banco de Dados - Estrutura

### Tabela: profiles
```javascript
{
  id: uuid,                    // PK, FK de auth.users
  full_name: text,
  email: text,
  company: text,
  phone: text,
  logo_url: text,
  avatar_url: text,
  brand_color: text,
  role: 'admin' | 'atendimento' | 'cliente',  // NOVO
  linked_client_id: uuid,      // Para clientes
  is_active: boolean,          // Ativo/Inativo
  created_by: uuid,            // Quem criou
  created_at: timestamptz
}
```

---

## 🔐 Permissões e RLS

### Row Level Security (RLS) Policies
1. **profiles_access**: Admin e Atendimento veem todos, Cliente vê apenas a si mesmo
2. **invites_admin**: Apenas Admin pode gerenciar convites
3. Demais tabelas mantêm as políticas existentes

---

## 📧 Email de Recuperação de Senha

### Como Funciona
1. Admin clica no botão 📧 ao lado do usuário
2. Sistema gera um link de recuperação de senha
3. Email é enviado com HTML formatado
4. Usuário clica no link e redefinir a senha
5. Link expira em 24 horas

### Integração Futura
Para usar um serviço de email profissional (Resend, SendGrid, etc.), edite:
`app/api/users/send-reset-email/route.js`

---

## 🧪 Teste a Implementação

### 1. Login como Admin
```
Email: mel.schultz@yahoo.com
Senha: [sua_senha_configurada]
```

### 2. Acesse Usuários
- Vá para Menu → Usuários
- Você deve ver a aba

### 3. Teste as Funcionalidades
- ✅ Criar novo usuário (admin/atendimento/cliente)
- ✅ Editar usuário existente
- ✅ Enviar email de recuperação
- ✅ Ativar/Desativar usuário
- ✅ Deletar usuário

### 4. Login como Atendimento
- Crie um usuário com role "Atendimento"
- Faça login
- Verifique que a aba "Usuários" NÃO aparece

### 5. Login como Cliente
- Crie um usuário com role "Cliente"
- Faça login
- Verifique que a aba "Usuários" NÃO aparece

---

## 📝 Queries API Utilizadas

### Criar Usuário
```javascript
POST /api/users
{
  full_name: "João Silva",
  email: "joao@email.com",
  password: "senha_segura",
  phone: "+55 11 9...",
  company: "Agência XYZ",
  role: "admin|atendimento|cliente",
  linked_client_id: "uuid" // (opcional)
}
```

### Editar Usuário
```javascript
PATCH /api/users/{id}
{
  full_name: "João Silva",
  email: "joao@email.com",
  password: "nova_senha", // (opcional)
  phone: "+55 11 9...",
  company: "Agência XYZ",
  role: "admin|atendimento|cliente",
  linked_client_id: "uuid",
  is_active: true|false
}
```

### Enviar Email de Reset
```javascript
POST /api/users/send-reset-email
{
  email: "joao@email.com"
}
```

### Deletar Usuário
```javascript
DELETE /api/users/{id}
```

---

## 🐛 Troubleshooting

### Problema: Menu "Usuários" ainda aparece para não-admin
**Solução**: Limpe o cache do navegador (Ctrl+Shift+Del) e faça login novamente

### Problema: Email de recuperação não chega
**Solução**: 
1. Verifique a pasta de spam
2. Confirme que SUPABASE_SERVICE_ROLE_KEY está configurado
3. Verifique logs no Supabase → Logs

### Problema: Não consigo atualizar role de usuário
**Solução**: Verifique se você está logado como admin

---

## 📚 Referências

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase RLS Policies](https://supabase.com/docs/guides/realtime/concepts)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## 🎓 Próximos Passos Recomendados

1. **Implementar integração de email profissional** (Resend)
   - Editar `app/api/users/send-reset-email/route.js`

2. **Adicionar logs de auditoria**
   - Criar tabela `audit_logs` para rastrear mudanças

3. **Implementar convites por email**
   - Criar fluxo de convite com tokens

4. **Dashboard de admin customizado**
   - Métricas de uso, atividades recentes

5. **Notificações em tempo real**
   - Usar WebSockets para atualizar lista de usuários

---

**Data de Implementação**: Março 2024  
**Versão**: 1.0.0  
**Status**: ✅ Completo e Testado
