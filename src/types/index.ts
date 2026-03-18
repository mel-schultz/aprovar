export interface Profile {
  id: string;
  full_name: string;
  company: string;
  logo_url: string | null;
  brand_color: string;
  created_at: string;
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

export interface TeamMember {
  id: string;
  profile_id: string;
  email: string;
  name: string | null;
  role: "admin" | "member";
  invited_at: string;
  accepted: boolean;
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
