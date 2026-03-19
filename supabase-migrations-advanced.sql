-- ============================================================
-- MIGRAÇÕES: Auditoria e Notificações de Email
-- ============================================================
-- Execute essas migrações no Supabase para usar as funcionalidades
-- de auditoria e notificações de email.

-- ============================================================
-- 1. Tabela de Logs de Auditoria
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_user_id ON audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_user_id ON audit_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- RLS Policy - Apenas admins podem visualizar
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON audit_logs
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================
-- 2. Tabela de Logs de Email
-- ============================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'welcome', 'password_reset', 'change_notification'
  subject VARCHAR(255),
  body TEXT,
  status VARCHAR(50) DEFAULT 'queued', -- 'queued', 'sent', 'failed'
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at);

-- RLS Policy - Apenas admins podem visualizar
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email logs"
  ON email_logs
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================
-- 3. Atualizar Tabela de Profiles (se necessário)
-- ============================================================
-- Adicionar coluna para rastrear quem criou o usuário
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- ============================================================
-- 4. Função para Auto-atualizar updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para audit_logs
CREATE TRIGGER update_audit_logs_updated_at
  BEFORE UPDATE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers para email_logs
CREATE TRIGGER update_email_logs_updated_at
  BEFORE UPDATE ON email_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers para profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. Visualizações Úteis
-- ============================================================

-- View: Últimas ações de auditoria com informações do admin
CREATE OR REPLACE VIEW v_audit_logs_detailed AS
SELECT 
  a.id,
  a.action,
  a.target_user_id,
  p1.full_name AS admin_name,
  p1.email AS admin_email,
  p2.full_name AS target_user_name,
  p2.email AS target_user_email,
  a.details,
  a.created_at
FROM audit_logs a
LEFT JOIN profiles p1 ON a.admin_user_id = p1.id
LEFT JOIN profiles p2 ON a.target_user_id = p2.id
ORDER BY a.created_at DESC;

-- View: Estatísticas de usuários por role
CREATE OR REPLACE VIEW v_user_stats AS
SELECT 
  role,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active THEN 1 END) as active,
  COUNT(CASE WHEN NOT is_active THEN 1 END) as inactive
FROM profiles
GROUP BY role;

-- ============================================================
-- 6. Dados de Exemplo (Opcional - Remover em Produção)
-- ============================================================
-- Insert para testar auditoria (comentado por padrão)
/*
INSERT INTO audit_logs (action, admin_user_id, target_user_id, details)
VALUES (
  'user_created',
  'seu-uuid-de-admin',
  'novo-usuario-uuid',
  '{"email": "novo@empresa.com", "role": "cliente"}'::jsonb
);
*/

-- ============================================================
-- 7. Limpar Dados Antigos (Schedule - Opcional)
-- ============================================================
-- Em produção, execute regularmente para limpar logs antigos
-- Esta consulta remove logs com mais de 90 dias:

/*
DELETE FROM email_logs 
WHERE created_at < now() - INTERVAL '90 days' 
AND status = 'sent';

DELETE FROM audit_logs 
WHERE created_at < now() - INTERVAL '180 days';
*/

-- ============================================================
-- FIM DAS MIGRAÇÕES
-- ============================================================
