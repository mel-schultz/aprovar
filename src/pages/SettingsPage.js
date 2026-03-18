import { useState } from 'react'
import { Save, Palette, User, Building } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card, FormField } from '../components/ui'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const BRAND_COLORS = [
  '#0ea472', '#6366f1', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#3b82f6', '#10b981', '#e11d48', '#0ea5e9',
]

export default function SettingsPage() {
  const { profile, updateProfile, user } = useAuth()
  const [form, setForm] = useState({
    full_name:   profile?.full_name   || '',
    company:     profile?.company     || '',
    brand_color: profile?.brand_color || '#0ea472',
    logo_url:    profile?.logo_url    || '',
  })
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    let logo_url = form.logo_url
    if (logoFile) {
      const ext = logoFile.name.split('.').pop()
      const path = `logos/${user.id}.${ext}`
      const { error: upErr } = await supabase.storage.from('deliverables').upload(path, logoFile, { upsert: true })
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('deliverables').getPublicUrl(path)
        logo_url = publicUrl
      }
    }
    const { error } = await updateProfile({ ...form, logo_url })
    if (error) toast.error(error.message)
    else toast.success('Configurações salvas!')
    setSaving(false)
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) { toast.error('As senhas não coincidem.'); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.next })
    if (error) toast.error(error.message)
    else { toast.success('Senha atualizada!'); setPwForm({ current: '', next: '', confirm: '' }) }
    setPwSaving(false)
  }

  return (
    <div className="page-enter" style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26 }}>Configurações</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>Personalize sua conta e marca.</p>
      </div>

      {/* Profile */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <User size={18} color="var(--brand)" />
          <h2 style={{ fontSize: 16 }}>Perfil</h2>
        </div>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Seu nome">
              <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="João Silva" />
            </FormField>
            <FormField label="Empresa / Agência">
              <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Minha Agência" />
            </FormField>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>E-mail: <strong>{user?.email}</strong> (não editável)</p>
          <Button type="submit" loading={saving} size="sm"><Save size={14} /> Salvar perfil</Button>
        </form>
      </Card>

      {/* Whitelabel */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Palette size={18} color="var(--brand)" />
          <h2 style={{ fontSize: 16 }}>Identidade visual (Whitelabel)</h2>
        </div>

        {/* Preview */}
        <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          {form.logo_url
            ? <img src={form.logo_url} alt="logo" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'contain' }} />
            : <div style={{ width: 40, height: 40, borderRadius: 10, background: form.brand_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>
                {(form.company || 'A').charAt(0)}
              </div>
          }
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: form.brand_color }}>
            {form.company || 'Sua Agência'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 'auto' }}>Pré-visualização</span>
        </div>

        <FormField label="Logo (PNG ou SVG)">
          <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} style={{ padding: '8px 12px' }} />
        </FormField>

        <div style={{ marginBottom: 16 }}>
          <label>Cor da marca</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {BRAND_COLORS.map(c => (
              <button
                key={c}
                onClick={() => set('brand_color', c)}
                style={{
                  width: 32, height: 32, borderRadius: 8, background: c, border: 'none', cursor: 'pointer',
                  outline: form.brand_color === c ? `3px solid ${c}` : '3px solid transparent',
                  outlineOffset: 2, transition: 'outline .12s',
                }}
              />
            ))}
            <input type="color" value={form.brand_color} onChange={e => set('brand_color', e.target.value)} style={{ width: 32, height: 32, padding: 2, borderRadius: 8, border: '1.5px solid var(--border)', cursor: 'pointer' }} />
          </div>
        </div>

        <Button onClick={handleSave} loading={saving} size="sm"><Save size={14} /> Salvar aparência</Button>
      </Card>

      {/* Password */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Building size={18} color="var(--brand)" />
          <h2 style={{ fontSize: 16 }}>Alterar senha</h2>
        </div>
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
