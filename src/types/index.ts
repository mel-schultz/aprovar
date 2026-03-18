export type UserRole = "admin" | "atendimento" | "designer";

export interface Profile {
  id: string;
  full_name: string;
  company: string;
  logo_url: string | null;
  brand_color: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  profile_id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_manage_team: boolean;
  invited_at: string;
  accepted_at: string | null;
  last_login: string | null;
}

export interface Client {
  id: string;
  profile_id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  logo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  approvers?: Approver[];
}

export interface Approver {
  id: string;
  client_id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  created_at: string;
}

export interface Deliverable {
  id: string;
  client_id: string;
  profile_id: string;
  created_by: string | null;
  title: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  source: "upload" | "drive" | "canva";
  status: "pending" | "approved" | "rejected" | "revision";
  token: string;
  scheduled_at: string | null;
  published_at: string | null;
  network: "instagram" | "facebook" | "youtube" | "tiktok" | null;
  created_at: string;
  updated_at: string;
  clients?: Client;
}

export interface ApprovalEvent {
  id: string;
  deliverable_id: string;
  approver_id: string | null;
  action: "sent" | "viewed" | "approved" | "rejected" | "revision_requested";
  comment: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  profile_id: string;
  title: string;
  body: string | null;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  profile_id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  changes: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

// Permissões por role
export const ROLE_PERMISSIONS: Record<UserRole, Record<string, boolean>> = {
  admin: {
    can_create: true,
    can_edit: true,
    can_delete: true,
    can_manage_team: true,
    can_view_analytics: true,
    can_manage_clients: true,
    can_manage_deliverables: true,
  },
  atendimento: {
    can_create: true,
    can_edit: true,
    can_delete: false,
    can_manage_team: false,
    can_view_analytics: true,
    can_manage_clients: true,
    can_manage_deliverables: true,
  },
  designer: {
    can_create: true,
    can_edit: true,
    can_delete: false,
    can_manage_team: false,
    can_view_analytics: false,
    can_manage_clients: false,
    can_manage_deliverables: true,
  },
};

// Labels para roles
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  atendimento: "Atendimento",
  designer: "Designer",
};

// Cores para roles
export const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-red-100 text-red-900",
  atendimento: "bg-blue-100 text-blue-900",
  designer: "bg-purple-100 text-purple-900",
};
