export type UserRole = 'super_admin' | 'atendimento' | 'cliente'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  logo_url?: string
  created_at: string
  updated_at: string
  user_id?: string
}

export interface SocialAccount {
  id: string
  client_id: string
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
  account_name: string
  account_url?: string
  access_token?: string
  is_connected: boolean
  created_at: string
}

export interface Approval {
  id: string
  client_id: string
  title: string
  content: string
  media_urls: string[]
  platform: string
  scheduled_date?: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published'
  created_by: string
  notes?: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface BlogPost {
  id: string
  client_id: string
  title: string
  content: string
  excerpt?: string
  cover_image_url?: string
  status: 'draft' | 'review' | 'published'
  scheduled_date?: string
  created_by: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface Integration {
  id: string
  user_id: string
  type: 'google_drive' | 'notion' | 'slack'
  name: string
  is_connected: boolean
  config?: Record<string, string>
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: 'approval' | 'rejection' | 'comment' | 'publish' | 'system'
  is_read: boolean
  related_id?: string
  created_at: string
}
