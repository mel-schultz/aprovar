-- ============================================================
-- AprovaAí — Schema Supabase (PostgreSQL)
-- Execute no SQL Editor: https://app.supabase.com -> SQL Editor
-- ============================================================

-- Extensões
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELAS
-- ============================================================

-- Perfis de usuário (agências / profissionais)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  company     text,
  logo_url    text,
  brand_color text default '#6366f1',
  plan        text default 'trial' check (plan in ('trial','starter','intermediate','complete')),
  trial_ends  timestamptz default (now() + interval '7 days'),
  created_at  timestamptz default now()
);

-- Membros da equipe
create table if not exists public.team_members (
  id         uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade,
  email      text not null,
  name       text,
  role       text default 'member' check (role in ('admin','member')),
  invited_at timestamptz default now(),
  accepted   boolean default false
);

-- Clientes / Projetos
create table if not exists public.clients (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references public.profiles(id) on delete cascade,
  name        text not null,
  email       text,
  whatsapp    text,
  logo_url    text,
  notes       text,
  created_at  timestamptz default now()
);

-- Aprovadores por cliente
create table if not exists public.approvers (
  id         uuid primary key default uuid_generate_v4(),
  client_id  uuid references public.clients(id) on delete cascade,
  name       text not null,
  email      text,
  whatsapp   text,
  created_at timestamptz default now()
);

-- Entregáveis (conteúdo para aprovação)
create table if not exists public.deliverables (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid references public.clients(id) on delete cascade,
  profile_id    uuid references public.profiles(id) on delete cascade,
  title         text not null,
  description   text,
  file_url      text,
  file_type     text,
  source        text default 'upload' check (source in ('upload','drive','canva')),
  status        text default 'pending' check (status in ('pending','approved','rejected','revision')),
  token         uuid default uuid_generate_v4() unique,
  scheduled_at  timestamptz,
  published_at  timestamptz,
  network       text check (network in ('instagram','facebook','youtube','tiktok',null)),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Histórico de aprovações
create table if not exists public.approval_events (
  id             uuid primary key default uuid_generate_v4(),
  deliverable_id uuid references public.deliverables(id) on delete cascade,
  approver_id    uuid references public.approvers(id),
  action         text not null check (action in ('sent','viewed','approved','rejected','revision_requested')),
  comment        text,
  created_at     timestamptz default now()
);

-- Notificações
create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references public.profiles(id) on delete cascade,
  title       text not null,
  body        text,
  type        text default 'info' check (type in ('info','success','warning','error')),
  read        boolean default false,
  created_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles       enable row level security;
alter table public.team_members   enable row level security;
alter table public.clients        enable row level security;
alter table public.approvers      enable row level security;
alter table public.deliverables   enable row level security;
alter table public.approval_events enable row level security;
alter table public.notifications  enable row level security;

-- Profiles: cada usuário vê apenas o próprio perfil
create policy "Profiles: own" on public.profiles
  for all using (auth.uid() = id);

-- Team members: dono do profile acessa
create policy "Team: own profile" on public.team_members
  for all using (profile_id = auth.uid());

-- Clients: dono do profile acessa
create policy "Clients: own" on public.clients
  for all using (profile_id = auth.uid());

-- Approvers: via client do profile
create policy "Approvers: via client" on public.approvers
  for all using (
    exists (
      select 1 from public.clients c
      where c.id = approvers.client_id and c.profile_id = auth.uid()
    )
  );

-- Deliverables: dono acessa + aprovadores via token (acesso público por token)
create policy "Deliverables: own" on public.deliverables
  for all using (profile_id = auth.uid());

create policy "Deliverables: public token read" on public.deliverables
  for select using (true);

-- Approval events: dono acessa
create policy "Approval events: own" on public.approval_events
  for all using (
    exists (
      select 1 from public.deliverables d
      where d.id = approval_events.deliverable_id and d.profile_id = auth.uid()
    )
  );

create policy "Approval events: insert public" on public.approval_events
  for insert with check (true);

-- Notifications: próprias
create policy "Notifications: own" on public.notifications
  for all using (profile_id = auth.uid());

-- ============================================================
-- TRIGGER: atualizar updated_at em deliverables
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger deliverables_updated_at
  before update on public.deliverables
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- TRIGGER: criar perfil automaticamente após signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE BUCKET para arquivos de entregáveis
-- ============================================================
insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', true)
on conflict do nothing;

create policy "Deliverables storage: authenticated upload"
  on storage.objects for insert
  with check (bucket_id = 'deliverables' and auth.role() = 'authenticated');

create policy "Deliverables storage: public read"
  on storage.objects for select
  using (bucket_id = 'deliverables');
