-- ============================================================
-- Aprovar — Migration de correção (execute se o schema estiver
-- desatualizado no banco).
-- Roda com segurança em bancos já existentes: usa ADD COLUMN IF NOT EXISTS.
-- ============================================================

-- ── TABELA: clients ───────────────────────────────────────────
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS whatsapp  text,
  ADD COLUMN IF NOT EXISTS logo_url  text,
  ADD COLUMN IF NOT EXISTS notes     text;

-- ── TABELA: profiles ─────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone      text,
  ADD COLUMN IF NOT EXISTS logo_url   text,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS brand_color text default '#0ea472',
  ADD COLUMN IF NOT EXISTS linked_client_id uuid,
  ADD COLUMN IF NOT EXISTS is_active  boolean not null default true,
  ADD COLUMN IF NOT EXISTS created_by uuid;

-- ── TABELA: approvers ─────────────────────────────────────────
ALTER TABLE public.approvers
  ADD COLUMN IF NOT EXISTS whatsapp text;

-- ── TABELA: deliverables ─────────────────────────────────────
ALTER TABLE public.deliverables
  ADD COLUMN IF NOT EXISTS description  text,
  ADD COLUMN IF NOT EXISTS file_url     text,
  ADD COLUMN IF NOT EXISTS file_type    text,
  ADD COLUMN IF NOT EXISTS source       text default 'upload',
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS network      text,
  ADD COLUMN IF NOT EXISTS updated_at   timestamptz default now();

-- ── TABELA: user_invites ──────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_invites'
  ) THEN
    CREATE TABLE public.user_invites (
      id         uuid        primary key default uuid_generate_v4(),
      email      text        not null,
      role       text        not null default 'client' check (role in ('admin','client')),
      invited_by uuid        references public.profiles(id) on delete cascade,
      client_id  uuid        references public.clients(id) on delete set null,
      token      uuid        default uuid_generate_v4() unique,
      accepted   boolean     default false,
      expires_at timestamptz default (now() + interval '7 days'),
      created_at timestamptz default now()
    );
    ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "invites_admin" ON public.user_invites FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    );
    CREATE POLICY "invites_pub_read" ON public.user_invites FOR SELECT USING (true);
  END IF;
END $$;

-- ── FKs cruzadas em profiles (se não existirem) ───────────────
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS fk_profiles_linked_client,
  DROP CONSTRAINT IF EXISTS fk_profiles_created_by;

ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_linked_client
    FOREIGN KEY (linked_client_id) REFERENCES public.clients(id) ON DELETE SET NULL
    NOT VALID;

ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_created_by
    FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL
    NOT VALID;

-- ── FKs de relacionamento para o schema cache do PostgREST ────
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

-- ── CHECK constraints em deliverables (recriar se preciso) ────
ALTER TABLE public.deliverables
  DROP CONSTRAINT IF EXISTS deliverables_source_check,
  DROP CONSTRAINT IF EXISTS deliverables_status_check,
  DROP CONSTRAINT IF EXISTS deliverables_network_check;

ALTER TABLE public.deliverables
  ADD CONSTRAINT deliverables_source_check  CHECK (source  IN ('upload','drive','canva')),
  ADD CONSTRAINT deliverables_status_check  CHECK (status  IN ('pending','approved','rejected','revision')),
  ADD CONSTRAINT deliverables_network_check CHECK (network IN ('instagram','facebook','youtube','tiktok') OR network IS NULL);

-- ── Trigger updated_at em deliverables ───────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN new.updated_at = now(); RETURN new; END;
$$;

DROP TRIGGER IF EXISTS deliverables_updated_at ON public.deliverables;
CREATE TRIGGER deliverables_updated_at
  BEFORE UPDATE ON public.deliverables
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ── View users_with_clients (recriar para garantir) ──────────
CREATE OR REPLACE VIEW public.users_with_clients AS
  SELECT
    p.id, p.full_name, p.email, p.phone, p.company,
    p.role, p.is_active, p.avatar_url, p.linked_client_id, p.created_at,
    c.name AS client_name
  FROM public.profiles p
  LEFT JOIN public.clients c ON c.id = p.linked_client_id;

GRANT SELECT ON public.users_with_clients TO authenticated;

-- ── Forçar reload do schema cache ────────────────────────────
NOTIFY pgrst, 'reload schema';

-- ── Verificação final ─────────────────────────────────────────
SELECT
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'clients'
ORDER BY ordinal_position;
