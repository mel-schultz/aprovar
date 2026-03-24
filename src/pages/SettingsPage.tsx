import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Trash2, LogOut, Save } from 'lucide-react'

export default function SettingsPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'profile' | 'password' | 'danger'>('profile')
  const [loading, setLoading] = useState(false)

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
  })
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' })
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profileForm.full_name, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    setLoading(false)
    if (error) toast.error(error.message)
    else { toast.success('Perfil atualizado!'); refreshProfile() }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passForm.newPass !== passForm.confirm) { toast.error('Senhas não coincidem'); return }
    if (passForm.newPass.length < 6) { toast.error('Senha deve ter pelo menos 6 caracteres'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: passForm.newPass })
    setLoading(false)
    if (error) toast.error(error.message)
    else { toast.success('Senha alterada com sucesso!'); setPassForm({ current: '', newPass: '', confirm: '' }) }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  const handleDeleteRequest = async () => {
    if (deleteConfirm !== 'EXCLUIR') {
      toast.error('Digite "EXCLUIR" para confirmar')
      return
    }
    toast.success('Solicitação de exclusão enviada. Nossa equipe entrará em contato.')
    setDeleteConfirm('')
  }

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    atendimento: 'Atendimento',
    cliente: 'Cliente',
  }

  return (
    <div>
      <h1 className="page-title">Configurações</h1>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ width: 200, flexShrink: 0 }}>
          <div className="card" style={{ padding: 8 }}>
            {[
              { key: 'profile', label: 'Meu perfil', icon: User },
              { key: 'password', label: 'Senha', icon: Lock },
              { key: 'danger', label: 'Conta', icon: Trash2 },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`sidebar-nav-item${tab === key ? ' active' : ''}`}
                onClick={() => setTab(key as typeof tab)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
            <hr className="divider" />
            <button className="sidebar-nav-item" onClick={handleSignOut} style={{ color: '#cf222e' }}>
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {tab === 'profile' && (
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 20 }}>Informações do perfil</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div className="avatar" style={{ width: 56, height: 56, fontSize: 20 }}>
                  {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{profile?.full_name || 'Sem nome'}</div>
                  <div style={{ fontSize: 13, color: '#57606a' }}>{user?.email}</div>
                  <div style={{ marginTop: 4 }}>
                    <span className="status-badge status-published" style={{ fontSize: 11 }}>{roleLabel[profile?.role || 'cliente']}</span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleProfileSave}>
                <div className="form-group">
                  <label className="form-label">Nome completo</label>
                  <input
                    className="form-input"
                    value={profileForm.full_name}
                    onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input className="form-input" value={user?.email || ''} disabled style={{ background: '#f6f8fa', color: '#57606a' }} />
                  <div style={{ fontSize: 12, color: '#57606a', marginTop: 4 }}>O e-mail não pode ser alterado por aqui.</div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={14} />
                  {loading ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </form>
            </div>
          )}

          {tab === 'password' && (
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 20 }}>Alterar senha</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label className="form-label">Nova senha</label>
                  <input className="form-input" type="password" placeholder="Min. 6 caracteres" value={passForm.newPass} onChange={e => setPassForm(f => ({ ...f, newPass: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar nova senha</label>
                  <input className="form-input" type="password" placeholder="Repita a senha" value={passForm.confirm} onChange={e => setPassForm(f => ({ ...f, confirm: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Lock size={14} />
                  {loading ? 'Salvando...' : 'Alterar senha'}
                </button>
              </form>
            </div>
          )}

          {tab === 'danger' && (
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 8 }}>Zona de perigo</h3>
              <p style={{ fontSize: 14, color: '#57606a', marginBottom: 20 }}>Ações irreversíveis relacionadas à sua conta.</p>

              <div style={{ border: '1px solid #ff818266', borderRadius: 8, padding: 20, marginBottom: 20 }}>
                <h4 style={{ color: '#cf222e', margin: '0 0 8px', fontSize: 15 }}>Solicitar exclusão da conta</h4>
                <p style={{ fontSize: 13, color: '#57606a', margin: '0 0 16px' }}>
                  Ao solicitar a exclusão, nossa equipe entrará em contato para confirmar. Todos os seus dados serão permanentemente removidos.
                </p>
                <div className="form-group">
                  <label className="form-label">Digite <strong>EXCLUIR</strong> para confirmar</label>
                  <input
                    className="form-input"
                    placeholder="EXCLUIR"
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                    style={{ borderColor: deleteConfirm === 'EXCLUIR' ? '#cf222e' : undefined }}
                  />
                </div>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteRequest}
                  disabled={deleteConfirm !== 'EXCLUIR'}
                >
                  <Trash2 size={14} />
                  Solicitar exclusão da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
