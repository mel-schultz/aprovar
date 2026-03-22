-- =====================================================
-- CRIAR TABELA DE LOGS DE NOTIFICAÇÕES WHATSAPP
-- =====================================================

-- 1. Criar tabela whatsapp_logs
CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id BIGSERIAL PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'notification', -- 'notification', 'reminder', 'confirmation'
  service VARCHAR(50) DEFAULT 'twilio', -- 'twilio', 'evolution', 'webhook'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'delivered'
  details JSONB,
  error_message TEXT,
  external_id VARCHAR(255), -- ID da API externa (sid do Twilio, etc)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Criar índices
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_phone ON whatsapp_logs(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_status ON whatsapp_logs(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_created_at ON whatsapp_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_type ON whatsapp_logs(type);

-- 3. Criar tabela para configurações de notificações por cliente
CREATE TABLE IF NOT EXISTS client_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  whatsapp_enabled BOOLEAN DEFAULT true,
  whatsapp_phone VARCHAR(20),
  notify_on_pending BOOLEAN DEFAULT true,
  notify_on_approved BOOLEAN DEFAULT false,
  notify_on_rejected BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(client_id)
);

-- 4. Criar índices
CREATE INDEX IF NOT EXISTS idx_client_notification_settings_client_id ON client_notification_settings(client_id);

-- 5. Criar tabela para rastrear notificações enviadas por entregável
CREATE TABLE IF NOT EXISTS deliverable_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_id UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'created', 'approved', 'rejected'
  whatsapp_log_id BIGINT REFERENCES whatsapp_logs(id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Criar índices
CREATE INDEX IF NOT EXISTS idx_deliverable_notifications_deliverable_id ON deliverable_notifications(deliverable_id);
CREATE INDEX IF NOT EXISTS idx_deliverable_notifications_client_id ON deliverable_notifications(client_id);
CREATE INDEX IF NOT EXISTS idx_deliverable_notifications_type ON deliverable_notifications(notification_type);

-- 7. Habilitar RLS
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverable_notifications ENABLE ROW LEVEL SECURITY;

-- 8. Políticas RLS para whatsapp_logs (apenas admin vê)
CREATE POLICY "admin_view_whatsapp_logs" ON whatsapp_logs
FOR SELECT USING (
  auth.jwt() ->> 'role' IN ('admin', 'approver')
);

-- 9. Políticas RLS para client_notification_settings
CREATE POLICY "clients_manage_own_notification_settings" ON client_notification_settings
FOR ALL USING (
  -- Clientes podem ver/editar suas próprias configurações
  client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "admins_manage_all_notification_settings" ON client_notification_settings
FOR ALL USING (
  auth.jwt() ->> 'role' IN ('admin', 'approver')
);

-- 10. Políticas RLS para deliverable_notifications
CREATE POLICY "view_own_notifications" ON deliverable_notifications
FOR SELECT USING (
  -- Cliente vê notificações de seus entregáveis
  client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid())
  OR
  -- Admin vê tudo
  auth.jwt() ->> 'role' IN ('admin', 'approver')
);

-- 11. Criar view para notificações pendentes
CREATE OR REPLACE VIEW v_pending_notifications AS
SELECT 
  d.id as deliverable_id,
  c.id as client_id,
  c.name as client_name,
  c.whatsapp as client_whatsapp,
  d.title,
  d.status,
  cns.whatsapp_enabled,
  cns.whatsapp_phone,
  cns.notify_on_pending,
  d.created_at
FROM deliverables d
JOIN clients c ON d.client_id = c.id
LEFT JOIN client_notification_settings cns ON c.id = cns.client_id
WHERE d.status = 'pending' 
  AND cns.whatsapp_enabled = true
  AND cns.notify_on_pending = true
  AND NOT EXISTS (
    SELECT 1 FROM deliverable_notifications dn 
    WHERE dn.deliverable_id = d.id 
    AND dn.notification_type = 'created'
  );

-- 12. Criar função para auto-atualizar updated_at
CREATE OR REPLACE FUNCTION update_whatsapp_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Criar trigger
DROP TRIGGER IF EXISTS trigger_whatsapp_logs_updated_at ON whatsapp_logs;
CREATE TRIGGER trigger_whatsapp_logs_updated_at
BEFORE UPDATE ON whatsapp_logs
FOR EACH ROW
EXECUTE FUNCTION update_whatsapp_logs_updated_at();

-- 14. Criar função para auto-atualizar updated_at em client_notification_settings
CREATE OR REPLACE FUNCTION update_client_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. Criar trigger
DROP TRIGGER IF EXISTS trigger_client_notification_settings_updated_at ON client_notification_settings;
CREATE TRIGGER trigger_client_notification_settings_updated_at
BEFORE UPDATE ON client_notification_settings
FOR EACH ROW
EXECUTE FUNCTION update_client_notification_settings_updated_at();

-- =====================================================
-- INSERIR CONFIGURAÇÕES PADRÃO PARA CLIENTES EXISTENTES
-- =====================================================
INSERT INTO client_notification_settings (client_id, whatsapp_phone, whatsapp_enabled, notify_on_pending)
SELECT c.id, c.whatsapp, true, true
FROM clients c
WHERE NOT EXISTS (
  SELECT 1 FROM client_notification_settings cns WHERE cns.client_id = c.id
);

-- =====================================================
-- FIM DAS MIGRAÇÕES
-- =====================================================
