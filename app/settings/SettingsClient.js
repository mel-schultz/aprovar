'use client'

import { useState } from 'react'
import { Save, Palette, User } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { Button, Card, FormField } from '../../components/ui'
import toast from 'react-hot-toast'

const BRAND_COLORS = [
  '#0ea472','#6366f1','#f59e0b','#ef4444','#8b5cf6',
  '#ec4899','#14b8a6','#f97316','#3b82f6','#10b981',
  '#e11d48','#0ea5e9',
]

// Colunas que podem não existir ainda no banco (migration pendente)
const PROFILE_OPTIONAL_COLS = ['logo_url', 'brand_color', 'company', 'phone']

/**
 * Atualiza o profile removendo colunas desconhecidas se o banco retornar erro.
 */
async function safeProfileUpdate(supabase, profileId, updates) {
  // Tentativa 1: update completo
  const { error: e1 } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId)

  if (!e1) return { error: null }

  const isColError = e1.message && (
    e1.message.toLowerCase().includes('column') ||
    e1.message.toLowerCase().includes('schema cache') ||
    e1.message.toLowerCase().includes('not found')
  )
  if (!isColError) return { error: e1 }

  // Tentativa 2: remove colunas opcionais do payload
  const safeUpdates = { ...updates }
  PROFILE_OPTIONAL_COLS.forEach(col => delete safeUpdates[col])

  // Garante que sobrou pelo menos um campo para atualizar
  if (Object.keys(safeUpdates).length === 0) {
    return { error: new Error('Nenhum campo base disponível para atualizar.') }
  }

  const { error: e2 } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', profileId)

  return { error: e2 }
}

/**
 * Faz upload de arquivo para o storage.
 * Tenta bucket 'logos' primeiro; se não existir, usa 'deliverables'.
 */
async function uploadLogo(supabase, profileId, file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const path = `logos/${profileId}.${ext}`

  // Tenta bucket dedicado 'logos' primeiro
  for (const bucket of ['logos', 'deliverables']) {
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true })

    if (!upErr) {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)
      return { url: publicUrl, error: null }
    }

    // Se o bucket não existe ou sem permissão, tenta o próximo
    if (upErr.message?.includes('Bucket not found') ||
        upErr.message?.includes('not found') ||
        upErr.statusCode === 400) {
      continue
    }

    // Outro erro (ex: permissão)
    return { url: null, error: upErr }
  }

  return { url: null, error: new Error('Nenhum bucket de storage disponível. Crie o bucket "logos" no Supabase Dashboard → Storage.') }
}

export default function SettingsClient({ profile, userEmail }) {
  const supabase = createClient()

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    company:   profile?.company   || '',
  })
  const [brandForm, setBrandForm] = useState({
    brand_color: profile?.brand_color || '#0ea472',
    logo_url:    profile?.logo_url    || '',
  })
  const [logoFile, setLogoFile]   = useState(null)
  const [logoPreview, setLogoPreview] = useState(profile?.logo_url || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingBrand,   setSavingBrand]   = useState(false)
  const [pwForm, setPwForm]   = useState({ next: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)

  function setB(k, v) { setBrandForm(f => ({ ...f, [k]: v })) }

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    // Preview local imediato
    const reader = new FileReader()
    reader.onload = ev => setLogoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  // ── Salvar perfil ──────────────────────────────────────────
  async function handleSaveProfile(e) {
    e.preventDefault()
    setSavingProfile(true)
    const { error } = await safeProfileUpdate(supabase, profile.id, {
      full_name: profileForm.full_name,
      company:   profileForm.company,
    })
    if (error) toast.error('Erro ao salvar: ' + error.message)
    else toast.success('Perfil salvo!')
    setSavingProfile(false)
  }

  // ── Salvar aparência (logo + cor) ──────────────────────────
  async function handleSaveBrand(e) {
    e.preventDefault()
    setSavingBrand(true)

    let logo_url = brandForm.logo_url

    // Upload do arquivo se selecionado
    if (logoFile) {
      const { url, error: upErr } = await uploadLogo(supabase, profile.id, logoFile)
      if (upErr) {
        toast.error('Erro no upload: ' + upErr.message)
        setSavingBrand(false)
        return
      }
      logo_url = url
      setBrandForm(f => ({ ...f, logo_url }))
      setLogoPreview(url)
      setLogoFile(null)
    }

    const { error } = await safeProfileUpdate(supabase, profile.id, {
      brand_color: brandForm.brand_color,
      logo_url,
      company:     profileForm.company,
    })

    if (error) toast.error('Erro ao salvar aparência: ' + error.message)
    else toast.success('Aparência salva!')
    setSavingBrand(false)
  }

  // ── Alterar senha ──────────────────────────────────────────
  async function handlePasswordChange(e) {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) { toast.error('As senhas não coincidem.'); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.next })
    if (error) toast.error(error.message)
    else { toast.success('Senha atualizada!'); setPwForm({ next: '', confirm: '' }) }
    setPwSaving(false)
  }

  const displayName  = profileForm.company || 'Sua Agência'
  const displayColor = brandForm.brand_color
  const displayLogo  = logoPreview

  return (
    <div className="page-enter" style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 4 }}>Configurações</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Personalize sua conta e marca.</p>
      </div>

      {/* ── PERFIL ── */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <User size={18} color="var(--brand)" />
          <h2 style={{ fontSize: 16 }}>Perfil</h2>
        </div>
        <form onSubmit={handleSaveProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Seu nome">
              <input
                value={profileForm.full_name}
                onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="João Silva"
              />
            </FormField>
            <FormField label="Empresa / Agência">
              <input
                value={profileForm.company}
                onChange={e => setProfileForm(f => ({ ...f, company: e.target.value }))}
                placeholder="Minha Agência"
              />
            </FormField>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>
            E-mail: <strong>{userEmail}</strong>
          </p>
          <Button type="submit" loading={savingProfile} size="sm">
            <Save size={14} /> Salvar perfil
          </Button>
        </form>
      </Card>

      {/* ── IDENTIDADE VISUAL ── */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Palette size={18} color="var(--brand)" />
          <h2 style={{ fontSize: 16 }}>Identidade visual (Whitelabel)</h2>
        </div>

        {/* Preview */}
        <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          {displayLogo
            ? <img src={displayLogo} alt="logo" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'contain' }} />
            : <div style={{ width: 40, height: 40, borderRadius: 10, background: displayColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
          }
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: displayColor }}>
            {displayName}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 'auto' }}>Pré-visualização</span>
        </div>

        <form onSubmit={handleSaveBrand}>
          <FormField label="Logo (PNG ou SVG)">
            <input
              type="file"
              accept="image/png,image/svg+xml,image/jpeg,image/webp"
              onChange={handleLogoChange}
              style={{ padding: '8px 12px' }}
            />
          </FormField>

          {logoFile && (
            <p style={{ fontSize: 12, color: 'var(--brand)', marginBottom: 12 }}>
              ✓ Arquivo selecionado: {logoFile.name} — será enviado ao salvar.
            </p>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>
              Cor da marca
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {BRAND_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setB('brand_color', c)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: c, border: 'none', cursor: 'pointer',
                    outline: brandForm.brand_color === c ? `3px solid ${c}` : '3px solid transparent',
                    outlineOffset: 2,
                    transition: 'outline .12s',
                  }}
                  title={c}
                />
              ))}
              <input
                type="color"
                value={brandForm.brand_color}
                onChange={e => setB('brand_color', e.target.value)}
                style={{ width: 32, height: 32, padding: 2, borderRadius: 8, border: '1.5px solid var(--border)', cursor: 'pointer' }}
                title="Cor personalizada"
              />
            </div>
          </div>

          <Button type="submit" loading={savingBrand} size="sm">
            <Save size={14} /> Salvar aparência
          </Button>
        </form>
      </Card>

      {/* ── SENHA ── */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 20 }}>Alterar senha</h2>
        <form onSubmit={handlePasswordChange}>
          <FormField label="Nova senha">
            <input type="password" value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} placeholder="••••••••" minLength={6} required />
          </FormField>
          <FormField label="Confirmar nova senha">
            <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" minLength={6} required />
          </FormField>
          <Button type="submit" loading={pwSaving} size="sm">Alterar senha</Button>
        </form>
      </Card>
    </div>
  )
}
