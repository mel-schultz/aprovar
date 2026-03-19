-- ============================================================
-- Aprovar — Migration para bancos com schema desatualizado
-- Execute no SQL Editor do Supabase Dashboard
-- Seguro para rodar múltiplas vezes (IF NOT EXISTS em tudo)
-- ============================================================

-- ── 1. Adicionar colunas faltantes em clients ─────────────────
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS whatsapp  text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS logo_url  text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS notes     text;

-- ── 2. Adicionar colunas faltantes em approvers ───────────────
ALTER TABLE public.approvers ADD COLUMN IF NOT EXISTS whatsapp text;

-- ── 3. Adicionar colunas faltantes em profiles ────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone           text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url        text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url      text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS brand_color     text default '#0ea472';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linked_client_id uuid;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active       boolean not null default true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_by      uuid;

-- ── 4. Adicionar colunas faltantes em deliverables ────────────
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS description  text;
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS file_url     text;
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS file_type    text;
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS source       text default 'upload';
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS network      text;
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS updated_at   timestamptz default now();

-- ── 5. Recriar FKs para o schema cache do PostgREST ──────────
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

-- ── 6. Recriar view users_with_clients ───────────────────────
CREATE OR REPLACE VIEW public.users_with_clients AS
  SELECT
    p.id, p.full_name, p.email, p.phone, p.company,
    p.role, p.is_active, p.avatar_url, p.linked_client_id, p.created_at,
    c.name AS client_name
  FROM public.profiles p
  LEFT JOIN public.clients c ON c.id = p.linked_client_id;

GRANT SELECT ON public.users_with_clients TO authenticated;

-- ── 7. Forçar reload do schema cache ─────────────────────────
NOTIFY pgrst, 'reload schema';

-- ── 8. Confirmar resultado ────────────────────────────────────
-- Deve listar: id, profile_id, name, email, whatsapp, logo_url, notes, created_at
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'clients'
ORDER BY ordinal_position;
