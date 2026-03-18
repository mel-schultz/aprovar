import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type UserRole = "admin" | "atendimento" | "designer";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "planejamento" | "producao" | "aprovacao" | "publicado" | "arquivado";
  client_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  budget?: number;
  deadline?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  assigned_to: string;
  status: "pendente" | "em_progresso" | "revisao" | "concluida";
  priority: "baixa" | "media" | "alta" | "urgente";
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface Approval {
  id: string;
  task_id: string;
  requested_by: string;
  assigned_to: string;
  status: "pendente" | "aprovado" | "rejeitado";
  comments?: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  created_at: string;
}
