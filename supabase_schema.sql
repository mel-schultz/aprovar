-- ============================================================
-- Aprovar — Schema completo (v2)
-- Execute TUDO de uma vez no SQL Editor do Supabase
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── TABELA: profiles ─────────────────────────────────────────
create table if not exists public.profiles (
  id               uuid        primary key references auth.users(id) on delete cascade,
  full_name        text,
  company          text,
  email            text,
  phone            text,
  logo_url         text,
  avatar_url       text,
  brand_color      text        default '#0ea472',
  role             text        not null default 'admin' check (role in ('admin','client')),
  linked_client_id uuid,       -- preenchido depois (FK adicionada abaixo)
  is_active        boolean     not null default true,
  created_by       uuid,       -- FK adicionada abaixo
  created_at       timestamptz default now()
);

-- ── TABELA: clients ───────────────────────────────────────────
create table if not exists public.clients (
  id         uuid        primary key default uuid_generate_v4(),
  profile_id uuid        references public.profiles(id) on delete cascade,
  name       text        not null,
  email      text,
  whatsapp   text,
  logo_url   text,
  notes      text,
  created_at timestamptz default now()
);

-- FKs cruzadas entre profiles e clients
alter table public.profiles
  add constraint fk_profiles_linked_client
  foreign key (linked_client_id) references public.clients(id) on delete set null
  not valid;

alter table public.profiles
  add constraint fk_profiles_created_by
  foreign key (created_by) references public.profiles(id) on delete set null
  not valid;

-- ── TABELA: approvers ─────────────────────────────────────────
create table if not exists public.approvers (
  id         uuid        primary key default uuid_generate_v4(),
  client_id  uuid        references public.clients(id) on delete cascade,
  name       text        not null,
  email      text,
  whatsapp   text,
  created_at timestamptz default now()
);

-- ── TABELA: team_members ──────────────────────────────────────
create table if not exists public.team_members (
  id         uuid        primary key default uuid_generate_v4(),
  profile_id uuid        references public.profiles(id) on delete cascade,
  email      text        not null,
  name       text,
  role       text        default 'member' check (role in ('admin','member')),
  invited_at timestamptz default now(),
  accepted   boolean     default false
);

-- ── TABELA: deliverables ──────────────────────────────────────
create table if not exists public.deliverables (
  id           uuid        primary key default uuid_generate_v4(),
  client_id    uuid        references public.clients(id) on delete cascade,
  profile_id   uuid        references public.profiles(id) on delete cascade,
  title        text        not null,
  description  text,
  file_url     text,
  file_type    text,
  source       text        default 'upload' check (source in ('upload','drive','canva')),
  status       text        default 'pending' check (status in ('pending','approved','rejected','revision')),
  token        uuid        default uuid_generate_v4() unique,
  scheduled_at timestamptz,
  published_at timestamptz,
  network      text        check (network in ('instagram','facebook','youtube','tiktok',null)),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── TABELA: approval_events ───────────────────────────────────
create table if not exists public.approval_events (
  id             uuid        primary key default uuid_generate_v4(),
  deliverable_id uuid        references public.deliverables(id) on delete cascade,
  approver_id    uuid        references public.approvers(id),
  action         text        not null check (action in ('sent','viewed','approved','rejected','revision_requested','revision')),
  comment        text,
  created_at     timestamptz default now()
);

-- ── TABELA: user_invites ──────────────────────────────────────
create table if not exists public.user_invites (
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

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.team_members    enable row level security;
alter table public.clients         enable row level security;
alter table public.approvers       enable row level security;
alter table public.deliverables    enable row level security;
alter table public.approval_events enable row level security;
alter table public.user_invites    enable row level security;

-- Profiles: admin vê todos, user vê só o próprio
create policy "profiles_access" on public.profiles for all using (
  auth.uid() = id
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "team_own"       on public.team_members    for all using (profile_id = auth.uid());
create policy "clients_own"    on public.clients         for all using (profile_id = auth.uid());
create policy "approvers_own"  on public.approvers       for all using (
  exists (select 1 from public.clients c where c.id = approvers.client_id and c.profile_id = auth.uid())
);
create policy "deliverables_own"      on public.deliverables    for all using (profile_id = auth.uid());
create policy "deliverables_pub_read" on public.deliverables    for select using (true);
create policy "approval_events_own"   on public.approval_events for all using (
  exists (select 1 from public.deliverables d where d.id = approval_events.deliverable_id and d.profile_id = auth.uid())
);
create policy "approval_events_insert" on public.approval_events for insert with check (true);
create policy "invites_admin"  on public.user_invites    for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "invites_pub_read" on public.user_invites  for select using (true);

-- ── VIEW: users_with_clients ──────────────────────────────────
create or replace view public.users_with_clients as
  select
    p.id, p.full_name, p.email, p.phone, p.company,
    p.role, p.is_active, p.avatar_url, p.linked_client_id, p.created_at,
    c.name as client_name
  from public.profiles p
  left join public.clients c on c.id = p.linked_client_id;

grant select on public.users_with_clients to authenticated;

-- ── TRIGGER: updated_at em deliverables ──────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists deliverables_updated_at on public.deliverables;
create trigger deliverables_updated_at
  before update on public.deliverables
  for each row execute procedure public.set_updated_at();

-- ── TRIGGER: criar perfil completo ao signup ──────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare v_role text := 'admin';
begin
  if new.raw_user_meta_data->>'role' = 'client' then
    v_role := 'client';
  end if;
  insert into public.profiles (id, full_name, email, company, role, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.email,
    new.raw_user_meta_data->>'company',
    v_role,
    true
  )
  on conflict (id) do update set
    email     = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    company   = coalesce(excluded.company, profiles.company);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── STORAGE ───────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', true)
on conflict do nothing;

create policy "storage_upload" on storage.objects
  for insert with check (bucket_id = 'deliverables' and auth.role() = 'authenticated');
create policy "storage_read" on storage.objects
  for select using (bucket_id = 'deliverables');

-- ── DEFINIR mel.schultz@yahoo.com COMO ADMIN ─────────────────
do $$
declare v_id uuid;
begin
  select id into v_id from auth.users where email = 'mel.schultz@yahoo.com' limit 1;
  if v_id is not null then
    insert into public.profiles (id, email, role, full_name, is_active)
    values (v_id, 'mel.schultz@yahoo.com', 'admin', 'Mel Schultz', true)
    on conflict (id) do update set role='admin', is_active=true, email='mel.schultz@yahoo.com';
  end if;
end;
$$;

-- Sincronizar emails e nomes de perfis existentes sem esses campos
update public.profiles p
set
  email     = coalesce(p.email, u.email),
  full_name = coalesce(p.full_name, split_part(u.email,'@',1))
from auth.users u
where p.id = u.id and (p.email is null or p.full_name is null);
