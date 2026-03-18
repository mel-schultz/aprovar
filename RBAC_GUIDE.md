# Guia de Controle de Acesso por Função (RBAC)

## 📋 Visão Geral

O AprovaAí implementa um sistema de **Role-Based Access Control (RBAC)** com três níveis de acesso:

| Função | Descrição | Permissões |
|--------|-----------|-----------|
| **Admin** | Gerenciador da plataforma | Todas as permissões |
| **Atendimento** | Gerenciador de clientes | Criar, editar, visualizar (sem deletar) |
| **Designer** | Criador de conteúdo | Criar e editar conteúdo próprio |

---

## 🔐 Permissões por Função

### Administrador (admin)
- ✅ Criar conteúdo
- ✅ Editar conteúdo
- ✅ Deletar conteúdo
- ✅ Gerenciar equipe (convidar, remover, alterar permissões)
- ✅ Visualizar analytics
- ✅ Gerenciar clientes
- ✅ Gerenciar integrações

### Atendimento (atendimento)
- ✅ Criar conteúdo
- ✅ Editar conteúdo
- ❌ Deletar conteúdo
- ❌ Gerenciar equipe
- ✅ Visualizar analytics
- ✅ Gerenciar clientes
- ✅ Gerenciar entregáveis

### Designer (designer)
- ✅ Criar conteúdo
- ✅ Editar conteúdo próprio
- ❌ Deletar conteúdo
- ❌ Gerenciar equipe
- ❌ Visualizar analytics
- ❌ Gerenciar clientes
- ✅ Gerenciar entregáveis

---

## 🛠️ Como Usar

### 1. Verificar Permissão em Componentes

```tsx
import { usePermission } from "@/hooks/usePermission";

export function MyComponent() {
  const { canCreate, canDelete, isAdmin } = usePermission();

  return (
    <>
      {canCreate && <button>Criar</button>}
      {canDelete && <button>Deletar</button>}
      {isAdmin && <button>Gerenciar</button>}
    </>
  );
}
```

### 2. Proteger Rotas

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}
```

### 3. Verificar Permissão Específica

```tsx
import { useAuth } from "@/contexts/AuthContext";

export function DeleteButton() {
  const { hasPermission } = useAuth();

  if (!hasPermission("can_delete")) {
    return null;
  }

  return <button>Deletar</button>;
}
```

---

## 📊 Estrutura do Banco de Dados

### Tabela: `profiles`
```sql
- id (UUID) — ID do usuário
- full_name (TEXT) — Nome completo
- company (TEXT) — Empresa
- role (user_role) — Função (admin, atendimento, designer)
- is_active (BOOLEAN) — Ativo ou inativo
```

### Tabela: `team_members`
```sql
- id (UUID) — ID do membro
- profile_id (UUID) — Referência ao profile
- user_id (UUID) — Referência ao usuário Supabase
- email (TEXT) — E-mail
- full_name (TEXT) — Nome completo
- role (user_role) — Função
- can_create (BOOLEAN) — Permissão para criar
- can_edit (BOOLEAN) — Permissão para editar
- can_delete (BOOLEAN) — Permissão para deletar
- can_manage_team (BOOLEAN) — Permissão para gerenciar equipe
- is_active (BOOLEAN) — Ativo ou inativo
- accepted_at (TIMESTAMPTZ) — Data de aceitação do convite
- last_login (TIMESTAMPTZ) — Último acesso
```

---

## 🔑 Tipos TypeScript

```typescript
type UserRole = "admin" | "atendimento" | "designer";

interface Profile {
  id: string;
  full_name: string;
  company: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  profile_id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_manage_team: boolean;
  invited_at: string;
  accepted_at: string | null;
  last_login: string | null;
}
```

---

## 📝 Gerenciar Usuários

### Acessar Página de Usuários
- URL: `/users`
- Permissão necessária: `can_manage_team` ou `role === 'admin'`

### Operações Disponíveis

#### Convidar Novo Usuário
1. Clique em "Novo usuário"
2. Preencha nome, e-mail e função
3. Configure as permissões específicas
4. Clique em "Convidar"

#### Editar Usuário
1. Clique no ícone de edição
2. Altere os dados e permissões
3. Clique em "Atualizar"

#### Remover Usuário
1. Clique no ícone de lixeira
2. Confirme a remoção

---

## 🔒 Row Level Security (RLS)

O Supabase RLS garante que:

- Cada usuário vê apenas seus próprios dados
- Admins podem gerenciar dados da equipe
- Membros da equipe só acessam dados da sua organização
- Dados públicos (aprovações) são acessíveis via token

---

## 🚀 Boas Práticas

1. **Sempre verificar permissões no frontend e backend**
2. **Usar `usePermission()` para lógica condicional**
3. **Proteger rotas sensíveis com `ProtectedRoute`**
4. **Registrar ações em `audit_logs` para rastreabilidade**
5. **Nunca confiar apenas em verificações de frontend**

---

## 📞 Suporte

Para dúvidas sobre o sistema de RBAC, consulte:
- Arquivo de tipos: `src/types/index.ts`
- Hook de permissões: `src/hooks/usePermission.ts`
- Contexto de autenticação: `src/contexts/AuthContext.tsx`
- Página de gerenciamento: `src/app/users/page.tsx`
