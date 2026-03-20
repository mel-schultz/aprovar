-- =====================================================
-- CRIAR TABELA DE USUÁRIOS COM 3 NÍVEIS DE ACESSO
-- =====================================================

-- 1. Criar tabela usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'cliente',
  telefone VARCHAR(20),
  empresa VARCHAR(255),
  ativo BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX IF NOT EXISTS idx_usuarios_created_at ON usuarios(created_at);

-- 3. Criar função para auto-atualizar updated_at
CREATE OR REPLACE FUNCTION update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Criar trigger para updated_at
DROP TRIGGER IF EXISTS trigger_usuarios_updated_at ON usuarios;
CREATE TRIGGER trigger_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_usuarios_updated_at();

-- 5. Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- 6. Política de RLS - Super admin vê tudo
CREATE POLICY "super_admin_view_all" ON usuarios
FOR SELECT USING (
  auth.jwt() ->> 'email' = 'mel.schultz@yahoo.com'
);

-- 7. Política de RLS - Usuários veem seu próprio perfil
CREATE POLICY "users_view_own_profile" ON usuarios
FOR SELECT USING (
  auth.uid() = id
);

-- 8. Política de RLS - Apenas super admin pode inserir
CREATE POLICY "super_admin_insert" ON usuarios
FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' = 'mel.schultz@yahoo.com'
);

-- 9. Política de RLS - Apenas super admin pode atualizar
CREATE POLICY "super_admin_update" ON usuarios
FOR UPDATE USING (
  auth.jwt() ->> 'email' = 'mel.schultz@yahoo.com'
);

-- 10. Política de RLS - Apenas super admin pode deletar
CREATE POLICY "super_admin_delete" ON usuarios
FOR DELETE USING (
  auth.jwt() ->> 'email' = 'mel.schultz@yahoo.com'
);

-- 11. Criar VIEW com contagens
CREATE OR REPLACE VIEW v_usuarios_stats AS
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admin,
  COUNT(CASE WHEN role = 'atendimento' THEN 1 END) as atendimento,
  COUNT(CASE WHEN role = 'cliente' THEN 1 END) as cliente,
  COUNT(CASE WHEN ativo = true THEN 1 END) as ativos,
  COUNT(CASE WHEN ativo = false THEN 1 END) as inativos
FROM usuarios;

-- =====================================================
-- INSERIR SUPER ADMIN MANUALMENTE SE NÃO EXISTIR
-- =====================================================
-- Descomente e execute após criar o usuário no Auth:

/*
INSERT INTO usuarios (id, email, nome, role, ativo)
VALUES (
  'seu-user-id-aqui',
  'mel.schultz@yahoo.com',
  'Mel Schultz',
  'super_admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  nome = 'Mel Schultz',
  ativo = true;
*/

-- =====================================================
-- FIM DAS MIGRAÇÕES
-- =====================================================
