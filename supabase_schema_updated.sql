-- ============================================================
-- AprovaAí — Schema Supabase Atualizado com CRUD de Usuários
-- Execute no SQL Editor: https://app.supabase.com -> SQL Editor
-- ============================================================

-- Extensões
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS para Roles
-- ============================================================
create type user_role as enum ('admin', 'atendimento', 'designer');

-- ============================================================
-- TABELAS
-- ============================================================

-- Perfis de usuário (agências / profissionais)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  company     text,
  logo_url    text,
  brand_color text default '#0ea472',
  role        user_role default 'designer',
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Membros da equipe (com permissões mais detalhadas)
create table if not exists public.team_members (
  id              uuid primary key default uuid_generate_v4(),
  profile_id      uuid references public.profiles(id) on delete cascade,
  user_id         uuid references auth.users(id) on delete cascade,
  email           text not null unique,
  full_name       text,
  role            user_role default 'designer',
  is_active       boolean default true,
  can_create      boolean default false,
  can_edit        boolean default false,
  can_delete      boolean default false,
  can_manage_team boolean default false,
  invited_at      timestamptz default now(),
  accepted_at     timestamptz,
  last_login      timestamptz
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
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
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
  created_by    uuid references public.team_members(id),
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

-- Auditoria de ações
create table if not exists public.audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references public.profiles(id) on delete cascade,
  user_id     uuid references public.team_members(id),
  action      text not null,
  entity_type text,
  entity_id   uuid,
  changes     jsonb,
  ip_address  text,
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
alter table public.audit_logs     enable row level security;

-- Profiles: cada usuário vê apenas o próprio perfil
create policy "Profiles: own" on public.profiles
  for all using (auth.uid() = id);

-- Team members: dono do profile acessa + membros podem ver
create policy "Team: own profile members" on public.team_members
  for select using (
    profile_id = auth.uid() or 
    user_id = auth.uid()
  );

create policy "Team: admin manage" on public.team_members
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

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

-- Deliverables: dono acessa + criador pode ver
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

-- Audit logs: admin pode ver
create policy "Audit logs: admin" on public.audit_logs
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Atualizar updated_at em deliverables
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

-- Atualizar updated_at em profiles
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Atualizar updated_at em clients
create trigger clients_updated_at
  before update on public.clients
  for each row execute procedure public.set_updated_at();

-- Criar perfil automaticamente após signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'designer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Registrar auditoria de ações
create or replace function public.log_audit_action(
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_changes jsonb
)
returns void language plpgsql security definer as $$
declare
  v_profile_id uuid;
  v_team_member_id uuid;
begin
  v_profile_id := auth.uid();
  
  select id into v_team_member_id from public.team_members
  where user_id = v_profile_id limit 1;
  
  insert into public.audit_logs (profile_id, user_id, action, entity_type, entity_id, changes)
  values (v_profile_id, v_team_member_id, p_action, p_entity_type, p_entity_id, p_changes);
end;
$$;

-- ============================================================
-- STORAGE BUCKET
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
