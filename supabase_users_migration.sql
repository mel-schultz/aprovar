-- ============================================================
-- Aprovar — Migração completa: Usuários com roles
-- Execute no SQL Editor APÓS o schema base (supabase_schema.sql)
-- ============================================================

-- ── 1. Colunas extras na tabela profiles ─────────────────────
alter table public.profiles
  add column if not exists role             text        not null default 'admin'
    check (role in ('admin', 'client')),
  add column if not exists linked_client_id uuid        references public.clients(id) on delete set null,
  add column if not exists email            text,
  add column if not exists phone            text,
  add column if not exists avatar_url       text,
  add column if not exists is_active        boolean     not null default true,
  add column if not exists created_by       uuid        references public.profiles(id) on delete set null;

-- ── 2. Tabela de convites pendentes ──────────────────────────
create table if not exists public.user_invites (
  id          uuid        primary key default uuid_generate_v4(),
  email       text        not null,
  role        text        not null default 'client' check (role in ('admin','client')),
  invited_by  uuid        references public.profiles(id) on delete cascade,
  client_id   uuid        references public.clients(id)  on delete set null,
  token       uuid        default uuid_generate_v4() unique,
  accepted    boolean     default false,
  expires_at  timestamptz default (now() + interval '7 days'),
  created_at  timestamptz default now()
);

alter table public.user_invites enable row level security;

create policy "invites_admin_all" on public.user_invites
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "invites_public_read" on public.user_invites
  for select using (true);

-- ── 3. RLS de profiles: admin vê todos, client vê só o próprio ─
drop policy if exists "profiles_own"       on public.profiles;
drop policy if exists "profiles_admin_all" on public.profiles;

create policy "profiles_admin_all" on public.profiles
  for all using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── 4. View com dados enriquecidos de cada usuário ────────────
create or replace view public.users_with_clients as
  select
    p.id,
    p.full_name,
    p.email,
    p.phone,
    p.company,
    p.role,
    p.is_active,
    p.avatar_url,
    p.linked_client_id,
    p.created_at,
    c.name as client_name
  from public.profiles p
  left join public.clients c on c.id = p.linked_client_id;

grant select on public.users_with_clients to authenticated;

-- ── 5. Função helper: verifica se usuário logado é admin ──────
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ── 6. Trigger: criar perfil completo automaticamente ao signup ─
-- Substitui o trigger anterior para incluir email e role correto

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  v_role text := 'admin';  -- padrão: admin (pode ser sobrescrito abaixo)
begin
  -- mel.schultz@yahoo.com é sempre admin
  -- qualquer outro e-mail criado via Admin API com metadata.role='client'
  -- também é respeitado
  if new.raw_user_meta_data->>'role' = 'client' then
    v_role := 'client';
  end if;

  insert into public.profiles (
    id,
    full_name,
    email,
    company,
    role,
    is_active
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'company',
    v_role,
    true
  )
  on conflict (id) do update set
    email     = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    company   = coalesce(excluded.company,   profiles.company);

  return new;
end;
$$;

-- Recria o trigger (já existe, substitui)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 7. Definir mel.schultz@yahoo.com como ADMIN ──────────────
-- Atualiza o perfil existente (se já criou conta) E garante via trigger
-- para novos cadastros com esse e-mail.

update public.profiles
set
  role      = 'admin',
  is_active = true
where email = 'mel.schultz@yahoo.com';

-- Também atualiza diretamente pelo auth.users caso o perfil
-- ainda não tenha sido criado (trigger não rodou ainda)
do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id
  from auth.users
  where email = 'mel.schultz@yahoo.com'
  limit 1;

  if v_user_id is not null then
    insert into public.profiles (id, email, role, full_name, is_active)
    values (v_user_id, 'mel.schultz@yahoo.com', 'admin', 'Mel Schultz', true)
    on conflict (id) do update set
      role      = 'admin',
      is_active = true,
      email     = 'mel.schultz@yahoo.com';
  end if;
end;
$$;

-- ── 8. Sincronizar e-mails de perfis já existentes sem email ─
-- Preenche a coluna email em perfis criados antes desta migração
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;

-- ── 9. Garantir que todos os perfis existentes têm full_name ─
update public.profiles p
set full_name = coalesce(p.full_name, split_part(p.email, '@', 1))
where p.full_name is null and p.email is not null;
