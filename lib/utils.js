import { clsx } from 'clsx'

/** Combina classes condicionalmente */
export function cn(...inputs) {
  return clsx(inputs)
}

/** Formata bytes em string legível */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/** Retorna a URL pública de um arquivo no Supabase Storage */
export function getStorageUrl(bucket, path) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

/** Gera iniciais a partir de um nome */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

/** Mapa de labels de status */
export const STATUS_LABELS = {
  pending:  'Pendente',
  approved: 'Aprovado',
  rejected: 'Recusado',
  revision: 'Em revisão',
}

/** Mapa de cores de redes sociais */
export const NETWORK_COLORS = {
  instagram: '#e1306c',
  facebook:  '#1877f2',
  youtube:   '#ff0000',
  tiktok:    '#010101',
}
