'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import toast from 'react-hot-toast'
import { Trash2, Edit2, Mail, Shield, Users, UserCheck } from 'lucide-react'

const ROLES = {
  super_admin: { label: 'Super Admin', color: '#dc2626', icon: '👑' },
  atendimento: { label: 'Atendimento', color: '#06b6d4', icon: '👤' },
  cliente: { label: 'Cliente', color: '#8b5cf6', icon: '🧑' },
}

export default function UsersManagementClient({ profile }) {
  const supabase = createClient()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [editingUser, setEditingUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' ou 'edit'
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'cliente',
    phone: '',
    company: '',
  })

  // Verificar se é super admin
  const isSuperAdmin = profile?.is_super_admin || profile?.role === 'super_admin'

  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error('Acesso negado. Apenas super admin pode acessar.')
      return
    }

    loadUsers()
  }, [isSuperAdmin])

  async function loadUsers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  async function handleSendResetEmail(user) {
    try {
      const response = await fetch('/api/users/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })

      if (!response.ok) throw new Error('Erro ao enviar email')
      toast.success(`Email de recuperação enviado para ${user.email}`)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao enviar email')
    }
  }

  async function handleToggleStatus(user) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !user.is_active })
        .eq('id', user.id)

      if (error) throw error

      toast.success(user.is_active ? 'Usuário desativado' : 'Usuário reativado')
      loadUsers()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao alterar status')
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      toast.success('Usuário deletado')
      loadUsers()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao deletar usuário')
    }
  }

  async function handleSaveUser(e) {
    e.preventDefault()

    if (!formData.email || !formData.full_name) {
      toast.error('Preencha email e nome')
      return
    }

    try {
      if (modalMode === 'create') {
        // Criar novo usuário
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password || 'TempPass123!',
        })

        if (signUpError) throw signUpError

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            email: formData.email,
            full_name: formData.full_name,
            role: formData.role,
            phone: formData.phone || null,
            company: formData.company || null,
            is_active: true,
            is_super_admin: formData.role === 'super_admin',
          })

        if (profileError) throw profileError

        toast.success('Usuário criado com sucesso')
      } else {
        // Editar usuário existente
        const updateData = {
          full_name: formData.full_name,
          role: formData.role,
          phone: formData.phone || null,
          company: formData.company || null,
          is_super_admin: formData.role === 'super_admin',
        }

        // Se forneceu nova senha, atualizar também
        if (formData.password) {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            editingUser.id,
            { password: formData.password }
          )
          if (passwordError) throw passwordError
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', editingUser.id)

        if (profileError) throw profileError

        toast.success('Usuário atualizado')
      }

      setShowModal(false)
      setFormData({
        full_name: '',
        email: '',
        password: '',
        role: 'cliente',
        phone: '',
        company: '',
      })
      setEditingUser(null)
      loadUsers()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar usuário')
    }
  }

  function handleEditUser(user) {
    setEditingUser(user)
    setModalMode('edit')
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'cliente',
      phone: user.phone || '',
      company: user.company || '',
    })
    setShowModal(true)
  }

  function handleCreateNew() {
    setEditingUser(null)
    setModalMode('create')
    setFormData({
      full_name: '',
      email: '',
      password: '',
      role: 'cliente',
      phone: '',
      company: '',
    })
    setShowModal(true)
  }

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = filterRole === 'all' || user.role === filterRole
    return matchSearch && matchRole
  })

  if (!isSuperAdmin) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Acesso Negado</h2>
        <p>Apenas super admin pode acessar esta página.</p>
      </div>
    )
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando usuários...</div>
  }

  return (
    <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Gerenciamento de Usuários
        </h1>
        <p style={{ color: 'var(--text-2)', marginBottom: '20px' }}>
          Gerencie todos os usuários do sistema: atendimento e clientes
        </p>

        <button
          onClick={handleCreateNew}
          style={{
            background: 'var(--brand)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 200px',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <input
          type="text"
          placeholder="Procurar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          <option value="all">Todos os roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="atendimento">Atendimento</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>

      {/* Tabela de usuários */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                Nome
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                Email
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                Role
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                Status
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-2)' }}>
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    {user.full_name || '-'}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: ROLES[user.role]?.color + '20',
                      color: ROLES[user.role]?.color,
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {ROLES[user.role]?.label || user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <span style={{
                      color: user.is_active ? 'var(--brand)' : 'var(--text-3)',
                    }}>
                      {user.is_active ? '✓ Ativo' : '✗ Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleSendResetEmail(user)}
                        title="Enviar email de recuperação"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-2)',
                          padding: '4px',
                        }}
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        title="Editar"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-2)',
                          padding: '4px',
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title={user.is_active ? 'Desativar' : 'Ativar'}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: user.is_active ? 'var(--text-2)' : 'var(--text-3)',
                          padding: '4px',
                          opacity: user.is_active ? 1 : 0.5,
                        }}
                      >
                        <UserCheck size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        title="Deletar"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#dc2626',
                          padding: '4px',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ marginBottom: '20px' }}>
              {modalMode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
            </h2>

            <form onSubmit={handleSaveUser}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={modalMode === 'edit'}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    opacity: modalMode === 'edit' ? 0.6 : 1,
                  }}
                  required
                />
              </div>

              {modalMode === 'create' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    Senha
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Deixe em branco para gerar automaticamente"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              )}

              {modalMode === 'edit' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    Nova Senha (opcional)
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Deixe em branco para manter a senha atual"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Nível de Acesso
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                >
                  <option value="super_admin">Super Admin 👑</option>
                  <option value="atendimento">Atendimento 👤</option>
                  <option value="cliente">Cliente 🧑</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'var(--brand)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  {modalMode === 'create' ? 'Criar' : 'Atualizar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'var(--surface-3)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
