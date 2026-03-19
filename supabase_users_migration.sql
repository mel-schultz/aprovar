-- ============================================================
-- Aprovar — Migração: CRUD de Usuários
-- Execute no SQL Editor APÓS o schema base já ter sido aplicado
-- ============================================================

-- 1. Adicionar coluna role à tabela profiles
-- Valores: 'admin' (acesso total) | 'client' (portal de aprovação)
alter table public.profiles
  add column if not exists role text not null default 'admin'
  check (role in ('admin', 'client'));

-- 2. Adicionar vínculo opcional de um perfil client a um cliente da plataforma
alter table public.profiles
  add column if not exists linked_client_id uuid
  references public.clients(id) on delete set null;

-- 3. Adicionar campos extras ao perfil
alter table public.profiles
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists avatar_url text,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_by uuid references public.profiles(id) on delete set null;

-- 4. Tabela de convites pendentes (para convidar usuários por e-mail)
create table if not exists public.user_invites (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null,
  role        text not null default 'client' check (role in ('admin', 'client')),
  invited_by  uuid references public.profiles(id) on delete cascade,
  client_id   uuid references public.clients(id) on delete set null,
  token       uuid default uuid_generate_v4() unique,
  accepted    boolean default false,
  expires_at  timestamptz default (now() + interval '7 days'),
  created_at  timestamptz default now()
);

-- 5. RLS para user_invites
alter table public.user_invites enable row level security;

create policy "invites_admin_all" on public.user_invites
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "invites_public_read" on public.user_invites
  for select using (true);

-- 6. Atualizar RLS de profiles: admins veem todos, clients veem só o próprio
drop policy if exists "profiles_own" on public.profiles;

create policy "profiles_admin_all" on public.profiles
  for all using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- 7. View útil: lista de usuários com nome do cliente vinculado
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

-- 8. Função para verificar se o usuário atual é admin
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
