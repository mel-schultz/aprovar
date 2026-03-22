-- ============================================================
-- Aprovar — SQL gerado com base no schema REAL do banco
-- Tabelas existentes: approvals, assets, clients, comments,
--   notifications, profiles, projects, tasks, tickets
-- clients real: id, name, email, phone, company, created_at, updated_at
-- profiles real: id, email, full_name, role, avatar_url, created_at, updated_at
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Colunas faltantes em profiles ─────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone            text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url         text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS brand_color      text DEFAULT '#0ea472';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company          text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linked_client_id uuid;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active        boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_by       uuid;

-- ── 2. Colunas faltantes em clients ──────────────────────────
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS profile_id uuid;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS whatsapp   text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS logo_url   text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS notes      text;

-- FK de clients.profile_id → profiles.id
ALTER TABLE public.clients
  DROP CONSTRAINT IF EXISTS clients_profile_id_fkey;
ALTER TABLE public.clients
  ADD CONSTRAINT clients_profile_id_fkey
  FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ── 3. TABELA: approvers ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.approvers (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id  uuid        REFERENCES public.clients(id) ON DELETE CASCADE,
  name       text        NOT NULL,
  email      text,
  whatsapp   text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.approvers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "approvers_own" ON public.approvers;
CREATE POLICY "approvers_own" ON public.approvers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = approvers.client_id
      AND c.profile_id = auth.uid()
  )
);

-- ── 4. TABELA: deliverables ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.deliverables (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id    uuid        REFERENCES public.clients(id) ON DELETE CASCADE,
  profile_id   uuid        REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  description  text,
  file_url     text,
  file_type    text,
  source       text        DEFAULT 'upload' CHECK (source IN ('upload','drive','canva')),
  status       text        DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','revision')),
  token        uuid        DEFAULT uuid_generate_v4() UNIQUE,
  scheduled_at timestamptz,
  published_at timestamptz,
  network      text        CHECK (network IN ('instagram','facebook','youtube','tiktok') OR network IS NULL),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deliverables_own"      ON public.deliverables;
DROP POLICY IF EXISTS "deliverables_pub_read" ON public.deliverables;
CREATE POLICY "deliverables_own"      ON public.deliverables FOR ALL    USING (profile_id = auth.uid());
CREATE POLICY "deliverables_pub_read" ON public.deliverables FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN new.updated_at = now(); RETURN new; END;
$$;

DROP TRIGGER IF EXISTS deliverables_updated_at ON public.deliverables;
CREATE TRIGGER deliverables_updated_at
  BEFORE UPDATE ON public.deliverables
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ── 5. TABELA: approval_events ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.approval_events (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deliverable_id uuid REFERENCES public.deliverables(id) ON DELETE CASCADE,
  approver_id    uuid REFERENCES public.approvers(id),
  action         text NOT NULL CHECK (action IN ('sent','viewed','approved','rejected','revision_requested','revision')),
  comment        text,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE public.approval_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "approval_events_own"    ON public.approval_events;
DROP POLICY IF EXISTS "approval_events_insert" ON public.approval_events;
CREATE POLICY "approval_events_own" ON public.approval_events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.deliverables d
    WHERE d.id = approval_events.deliverable_id
      AND d.profile_id = auth.uid()
  )
);
CREATE POLICY "approval_events_insert" ON public.approval_events
  FOR INSERT WITH CHECK (true);

-- ── 6. TABELA: team_members ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.team_members (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid        REFERENCES public.profiles(id) ON DELETE CASCADE,
  email      text        NOT NULL,
  name       text,
  role       text        DEFAULT 'member' CHECK (role IN ('admin','member')),
  invited_at timestamptz DEFAULT now(),
  accepted   boolean     DEFAULT false
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "team_own" ON public.team_members;
CREATE POLICY "team_own" ON public.team_members FOR ALL USING (profile_id = auth.uid());

-- ── 7. TABELA: user_invites ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_invites (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      text        NOT NULL,
  role       text        NOT NULL DEFAULT 'client' CHECK (role IN ('admin','client')),
  invited_by uuid        REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id  uuid        REFERENCES public.clients(id) ON DELETE SET NULL,
  token      uuid        DEFAULT uuid_generate_v4() UNIQUE,
  accepted   boolean     DEFAULT false,
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "invites_admin"    ON public.user_invites;
DROP POLICY IF EXISTS "invites_pub_read" ON public.user_invites;
CREATE POLICY "invites_admin" ON public.user_invites FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "invites_pub_read" ON public.user_invites FOR SELECT USING (true);

-- ── 8. FKs para o schema cache do PostgREST ──────────────────
ALTER TABLE public.approvers
  DROP CONSTRAINT IF EXISTS approvers_client_id_fkey;
ALTER TABLE public.approvers
  ADD CONSTRAINT approvers_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.deliverables
  DROP CONSTRAINT IF EXISTS deliverables_client_id_fkey;
ALTER TABLE public.deliverables
  ADD CONSTRAINT deliverables_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.deliverables
  DROP CONSTRAINT IF EXISTS deliverables_profile_id_fkey;
ALTER TABLE public.deliverables
  ADD CONSTRAINT deliverables_profile_id_fkey
  FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- FK de profiles.linked_client_id → clients.id (após clients ter profile_id)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS fk_profiles_linked_client;
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_linked_client
  FOREIGN KEY (linked_client_id) REFERENCES public.clients(id) ON DELETE SET NULL
  NOT VALID;

-- ── 9. View users_with_clients ────────────────────────────────
CREATE OR REPLACE VIEW public.users_with_clients AS
  SELECT
    p.id, p.full_name, p.email, p.phone, p.company,
    p.role, p.is_active, p.avatar_url, p.linked_client_id, p.created_at,
    c.name AS client_name
  FROM public.profiles p
  LEFT JOIN public.clients c ON c.id = p.linked_client_id;

GRANT SELECT ON public.users_with_clients TO authenticated;

-- ── 10. Storage bucket ────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('deliverables', 'deliverables', true)
ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "storage_upload" ON storage.objects;
DROP POLICY IF EXISTS "storage_read"   ON storage.objects;
CREATE POLICY "storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'deliverables' AND auth.role() = 'authenticated');
CREATE POLICY "storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'deliverables');

-- ── 11. Forçar reload do schema cache ────────────────────────
-- Método 1: NOTIFY direto
NOTIFY pgrst, 'reload schema';

-- Método 2: via pg_notify (mais confiável em alguns setups do Supabase)
SELECT pg_notify('pgrst', 'reload schema');

-- ── 12. Verificação final ─────────────────────────────────────
-- Deve retornar 5 linhas: approvers, deliverables, approval_events,
--                         team_members, user_invites
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('approvers','deliverables','approval_events','team_members','user_invites')
ORDER BY table_name;

-- ── Bucket de logos (separado do bucket de deliverables) ──────
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "logos_upload" ON storage.objects;
DROP POLICY IF EXISTS "logos_read"   ON storage.objects;
CREATE POLICY "logos_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "logos_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "logos_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');
