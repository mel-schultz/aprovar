-- =====================================================
-- MIGRATIONS PARA APROVAI
-- =====================================================

-- 1. CRIAR TABELA USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CRIAR TABELA CLIENTS
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  cnpj VARCHAR(20),
  phone VARCHAR(20),
  address TEXT,
  logo_url VARCHAR(500),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CRIAR TABELA DELIVERABLES
CREATE TABLE IF NOT EXISTS deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CRIAR TABELA EVENTS
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CRIAR TABELA APPROVALS
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  comment TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_client_id ON deliverables(client_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_approvals_deliverable_id ON approvals(deliverable_id);

-- =====================================================
-- HABILITAR RLS
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - USERS
-- =====================================================
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_select_all_admin" ON users
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- =====================================================
-- RLS POLICIES - CLIENTS
-- =====================================================
CREATE POLICY "clients_select_own" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "clients_select_admin" ON clients
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "clients_insert_own" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "clients_update_own" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "clients_delete_own" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - DELIVERABLES
-- =====================================================
CREATE POLICY "deliverables_select_own" ON deliverables
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients WHERE clients.id = deliverables.client_id 
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "deliverables_select_admin" ON deliverables
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "deliverables_insert_own" ON deliverables
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients WHERE clients.id = client_id 
      AND clients.user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - EVENTS
-- =====================================================
CREATE POLICY "events_select_own" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "events_insert_own" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "events_update_own" ON events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "events_delete_own" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - APPROVALS
-- =====================================================
CREATE POLICY "approvals_select" ON approvals
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
    OR approved_by = auth.uid()
  );

-- =====================================================
-- FUNÇÃO: CREATE USER ON AUTH SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'cliente'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER: AUTO CREATE USER
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INSERT DEMO DATA (opcional)
-- =====================================================
-- Descomente abaixo para inserir dados de demo após setup
/*
-- Insira um usuário admin real depois de criar uma conta no app
-- UPDATE users SET role = 'admin' WHERE email = 'seu@email.com';
*/

COMMIT;
