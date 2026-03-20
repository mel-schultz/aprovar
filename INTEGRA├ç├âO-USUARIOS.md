# ✅ Integração do Gerenciamento de Usuários

## 🎯 O Que Foi Adicionado

Um **sistema completo de gerenciamento de usuários** integrado ao menu existente:

- ✅ Menu "Usuários" linkado
- ✅ Apenas Super Admin (mel.schultz@yahoo.com) tem acesso
- ✅ CRUD completo (criar, listar, editar, deletar)
- ✅ 4 níveis de acesso: Super Admin, Admin, Atendimento, Cliente
- ✅ Interface integrada ao AppLayout existente
- ✅ Dashboard com estatísticas

---

## 📂 Arquivos Adicionados

### Página
- `app/users/page.js` - ✅ Atualizada com proteção correta
- `app/users/UsuariosManagementClient.js` - Nova interface React

### APIs
- `app/api/admin/usuarios/route.js` - GET e POST (listar e criar)
- `app/api/admin/usuarios/[id]/route.js` - PATCH e DELETE (editar e deletar)

### Banco de Dados
- `supabase-migration-usuarios.sql` - Migrações SQL

---

## 🚀 Como Integrar (3 Passos)

### **Passo 1: Executar Migrações SQL**

1. Abra **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Cole o arquivo: `supabase-migration-usuarios.sql`
4. Clique **Run** ✅

Isso cria a tabela `usuarios` com:
- RLS (Row Level Security)
- Índices otimizados
- Triggers para updated_at

### **Passo 2: Inserir Você como Super Admin**

No SQL Editor, execute:

```sql
INSERT INTO usuarios (id, email, nome, role, ativo)
VALUES ('SEU-USER-ID-AQUI', 'mel.schultz@yahoo.com', 'Mel Schultz', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
```

**Como encontrar seu USER ID:**
1. Vá para **Supabase > Authentication > Users**
2. Procure por `mel.schultz@yahoo.com`
3. Copie o **User ID** (UUID comprido)

### **Passo 3: Fazer Git Push**

```bash
git add .
git commit -m "Adicionar gerenciamento de usuários integrado"
git push origin main
```

---

## ✅ Testar

1. **Localmente:**
   ```bash
   npm run dev
   ```
   Acesse: http://localhost:3000/users

2. **No Vercel:**
   ```
   https://seu-dominio.vercel.app/users
   ```

3. **Fazer login com:** mel.schultz@yahoo.com

4. **Você verá:**
   - Dashboard com 6 cards de estatísticas
   - Botão "Novo Usuário" (vermelho)
   - Tabela de usuários
   - Filtros (busca + nível de acesso)
   - Botões de editar/deletar

---

## 🔒 Segurança

### Quem Pode Acessar /users?

✅ **Apenas mel.schultz@yahoo.com** (Super Admin)

❌ **Outros usuários são redirecionados para /portal**

### O que o Super Admin Pode Fazer?

- ✅ Ver todos os usuários
- ✅ Criar novos usuários (com 4 níveis: super_admin, admin, atendimento, cliente)
- ✅ Editar qualquer usuário
- ✅ Deletar usuários (exceto a si mesmo)
- ✅ Mudar roles de outros usuários
- ✅ Ativar/desativar usuários

### O que Outros Usuários Podem Fazer?

❌ Nada! Redirecionados automaticamente para /portal

---

## 🎨 Interface

### Dashboard
- 4 cards com totais por role (Super Admin, Admin, Atendimento, Cliente)
- 2 cards com ativos/inativos
- Mostra total de usuários

### Filtros
- **Busca:** Por nome ou e-mail (em tempo real)
- **Nível:** Filtro por role (super_admin, admin, atendimento, cliente)

### Tabela
- **Colunas:** Nome, E-mail, Nível, Status, Ações
- **Nível:** Com cores diferentes por role
- **Status:** Ativo (verde) ou Inativo (vermelho)
- **Ações:** Botões de editar (lápis) e deletar (lixo)

### Modal de Criar/Editar
- **Nome:** Obrigatório
- **E-mail:** Obrigatório, único, válido
- **Senha:** Obrigatória para novo, opcional para edição
- **Role:** Dropdown com 4 opções
- **Telefone:** Opcional
- **Empresa:** Opcional
- **Status:** Toggle de ativo/inativo

---

## 📊 Banco de Dados

### Tabela: usuarios

```sql
id (UUID) - Referência do auth.users
email (VARCHAR) - Único
nome (VARCHAR)
role (super_admin | admin | atendimento | cliente)
telefone (VARCHAR) - Opcional
empresa (VARCHAR) - Opcional
ativo (BOOLEAN) - Padrão: true
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Índices Criados

- `idx_usuarios_email` - Busca rápida por e-mail
- `idx_usuarios_role` - Filtro por role
- `idx_usuarios_ativo` - Filtro por status
- `idx_usuarios_created_at` - Ordenação

### RLS (Row Level Security)

✅ **Super Admin vê tudo** - Acesso completo
✅ **Outros veem apenas seu perfil** - Proteção de dados

---

## 🔌 APIs

### GET /api/admin/usuarios

Lista todos os usuários

```bash
# Listar todos
curl https://seu-dominio/api/admin/usuarios

# Buscar
curl "https://seu-dominio/api/admin/usuarios?search=maria"

# Filtrar por role
curl "https://seu-dominio/api/admin/usuarios?role=atendimento"
```

**Resposta:**
```json
{
  "data": [...],
  "total": 10,
  "stats": {
    "total": 10,
    "super_admin": 1,
    "admin": 2,
    "atendimento": 3,
    "cliente": 4,
    "ativos": 9,
    "inativos": 1
  }
}
```

### POST /api/admin/usuarios

Criar novo usuário

```bash
curl -X POST https://seu-dominio/api/admin/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@empresa.com",
    "senha": "senha123",
    "nome": "Novo Usuário",
    "role": "atendimento",
    "telefone": "+55 11 9...",
    "empresa": "Empresa ABC"
  }'
```

### PATCH /api/admin/usuarios/[id]

Editar usuário

```bash
curl -X PATCH https://seu-dominio/api/admin/usuarios/uuid \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Nome Atualizado",
    "role": "admin",
    "ativo": true
  }'
```

### DELETE /api/admin/usuarios/[id]

Deletar usuário

```bash
curl -X DELETE https://seu-dominio/api/admin/usuarios/uuid
```

---

## 📝 Checklist de Implementação

- [ ] Executar migrações SQL
- [ ] Inserir Super Admin no banco
- [ ] Fazer git push
- [ ] Aguardar Vercel refazer build
- [ ] Fazer login com mel.schultz@yahoo.com
- [ ] Clicar em "Usuários" no menu
- [ ] Ver a página de gerenciamento
- [ ] Testar criar usuário
- [ ] Testar editar usuário
- [ ] Testar deletar usuário
- [ ] Testar filtros

---

## 🧪 Teste Rápido

### 1. Criar um usuário atendimento
- Clique "Novo Usuário"
- Preencha: João Silva, joao@empresa.com, senha123
- Role: Atendimento
- Clique "Criar"
- ✅ Deve aparecer na tabela

### 2. Editar o usuário
- Clique no ícone de lápis do usuário
- Altere para "Admin"
- Clique "Atualizar"
- ✅ Deve atualizar na tabela

### 3. Filtrar por role
- Selecione "Admin" no filtro de Nível
- ✅ Deve mostrar apenas admins

### 4. Deletar o usuário
- Clique no ícone de lixo
- Confirme
- ✅ Deve desaparecer da tabela

---

## 🚨 Se der Erro

### "Não autorizado"
- Você não é super admin
- Verifique: `SELECT email, role FROM usuarios WHERE email = 'mel.schultz@yahoo.com'`
- Deve estar `role = 'super_admin'`

### "Tabela não existe"
- Migrações SQL não foram executadas
- Abra Supabase SQL Editor
- Cole `supabase-migration-usuarios.sql`
- Clique Run

### "Erro ao criar usuário"
- E-mail já existe
- Use outro e-mail

### "Redirecionando para /portal"
- Seu email não é mel.schultz@yahoo.com
- Altere a constante `SUPER_ADMIN_EMAIL` em `page.js` ou insira-se no banco como super_admin

---

## 💡 Customizações Futuras

Você pode adicionar depois:

1. **Mais Admins** - Adicione outros e-mails à lista de super admins
2. **Auditoria** - Log de ações
3. **Notificações** - E-mail ao criar usuário
4. **2FA** - Autenticação de dois fatores
5. **Importação** - CSV/Excel
6. **Exportação** - CSV/Excel
7. **Webhooks** - Integrar com sistemas externos

---

## 📞 Resumo

✅ Menu "Usuários" está **linkado e funcional**
✅ Acesso **protegido apenas para Super Admin**
✅ CRUD **completo** (criar, listar, editar, deletar)
✅ **4 níveis de acesso** implementados
✅ Interface **integrada ao AppLayout**
✅ **Dashboard com estatísticas**
✅ **Banco de dados pronto**

---

**Próximo passo:** Executar as migrações SQL e inserir você como super admin!

Aproveite! 🚀
