'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Trash2, Edit2, Shield, User, Search, ToggleLeft, ToggleRight,
  Phone, Mail, Building2, Calendar, CheckCircle, XCircle, HeadsetIcon, Users,
  AlertCircle, Loader2, Eye, EyeOff, Download, History, CheckSquare, Square,
} from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES_CONFIG = {
  admin: {
    label: 'Administrador',
    description: 'Acesso total ao sistema',
    color: '#ef4444',
    bgColor: '#fee2e2',
    icon: Shield,
  },
  atendimento: {
    label: 'Atendimento',
    description: 'Suporte e aprovações',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    icon: HeadsetIcon,
  },
  cliente: {
    label: 'Cliente',
    description: 'Portal de aprovação',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    icon: User,
  },
}

function RoleBadge({ role }) {
  const cfg = ROLES_CONFIG[role]
  if (!cfg) return null
  const Icon = cfg.icon
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: '9999px',
      backgroundColor: cfg.bgColor,
      color: cfg.color,
      fontSize: '12px',
      fontWeight: '600',
    }}>
      <Icon size={14} />
      {cfg.label}
    </span>
  )
}

function StatusBadge({ active }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: '9999px',
      backgroundColor: active ? '#dcfce7' : '#fee2e2',
      color: active ? '#16a34a' : '#dc2626',
      fontSize: '12px',
      fontWeight: '600',
    }}>
      {active ? <CheckCircle size={14} /> : <XCircle size={14} />}
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '16px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function Button({ children, variant = 'primary', size = 'md', onClick, loading = false, disabled = false, ...props }) {
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '10px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' },
  }

  const variants = {
    primary: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
    },
    secondary: {
      backgroundColor: '#f3f4f6',
      color: '#1f2937',
      border: '1px solid #d1d5db',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
    },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...sizes[size],
        ...variants[variant],
        borderRadius: '8px',
        fontWeight: '500',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s',
        ...props.style,
      }}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}

function FormField({ label, required = false, children, error = null }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '6px',
        color: '#1f2937',
      }}>
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{
          marginTop: '4px',
          fontSize: '12px',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  )
}

function UserModal({ user = null, onSave, onCancel, loading = false }) {
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'cliente',
    phone: user?.phone || '',
    company: user?.company || '',
    is_active: user?.is_active ?? true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.full_name.trim()) newErrors.full_name = 'Nome obrigatório'
    if (!form.email.trim()) newErrors.email = 'E-mail obrigatório'
    if (!form.email.includes('@')) newErrors.email = 'E-mail inválido'
    if (!user && !form.password) newErrors.password = 'Senha obrigatória para novo usuário'
    if (form.password && form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    await onSave(form)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <Card style={{
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#1f2937',
        }}>
          {user ? 'Editar Usuário' : 'Novo Usuário'}
        </h2>

        <form onSubmit={handleSubmit}>
          <FormField label="Nível de Acesso" required>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}>
              {Object.entries(ROLES_CONFIG).map(([roleKey, roleCfg]) => {
                const Icon = roleCfg.icon
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => handleChange('role', roleKey)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: form.role === roleKey ? `2px solid ${roleCfg.color}` : '2px solid #e5e7eb',
                      backgroundColor: form.role === roleKey ? roleCfg.bgColor : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={20} color={roleCfg.color} style={{ marginBottom: '4px' }} />
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: roleCfg.color,
                      margin: '0',
                    }}>
                      {roleCfg.label}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      margin: '2px 0 0 0',
                    }}>
                      {roleCfg.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </FormField>

          <FormField label="Nome Completo" required error={errors.full_name}>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="João Silva"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </FormField>

          <FormField label="E-mail" required error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="joao@empresa.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </FormField>

          <FormField label={user ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha'} required={!user} error={errors.password}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  paddingRight: '40px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          <FormField label="Telefone">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+55 11 9...."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </FormField>

          <FormField label="Empresa">
            <input
              type="text"
              value={form.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Empresa ABC"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </FormField>

          <FormField label="Status">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
            }}>
              {form.is_active ? <CheckCircle size={20} color="#16a34a" /> : <XCircle size={20} color="#dc2626" />}
              <span style={{
                flex: 1,
                fontSize: '14px',
                fontWeight: '500',
              }}>
                {form.is_active ? 'Ativo' : 'Inativo'}
              </span>
              <button
                type="button"
                onClick={() => handleChange('is_active', !form.is_active)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {form.is_active ? <ToggleRight size={28} color="#3b82f6" /> : <ToggleLeft size={28} color="#d1d5db" />}
              </button>
            </div>
          </FormField>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
          }}>
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={loading}
            >
              {user ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

// Componente principal
export default function UsersClientV3() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState(new Set())
  const [auditLogs, setAuditLogs] = useState([])
  const [showAudit, setShowAudit] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchAuditLogs()
  }, [])

  const fetchUsers = async (role = '', status = '', search = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (role) params.append('role', role)
      if (status) params.append('status', status)
      if (search) params.append('search', search)

      const res = await fetch(`/api/users?${params.toString()}`)
      const { data, stats } = await res.json()
      setUsers(data || [])
      setStats(stats || {})
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs?limit=10')
      const { data } = await res.json()
      setAuditLogs(data || [])
    } catch (error) {
      console.error('Erro ao buscar logs:', error)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    fetchUsers(selectedRole, selectedStatus, term)
  }

  const handleRoleFilter = (role) => {
    setSelectedRole(role)
    fetchUsers(role, selectedStatus, searchTerm)
  }

  const handleStatusFilter = (status) => {
    setSelectedStatus(status)
    fetchUsers(selectedRole, status, searchTerm)
  }

  const handleToggleUser = (userId) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)))
    }
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedRole) params.append('role', selectedRole)
      if (selectedStatus) params.append('status', selectedStatus)
      
      const response = await fetch(`/api/export/users?${params.toString()}&format=csv`)
      const csv = await response.text()
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `usuarios-${new Date().toISOString().split('T')[0]}.csv`)
      link.click()
      
      toast.success('Arquivo exportado com sucesso!')
    } catch (error) {
      toast.error('Erro ao exportar dados')
    }
  }

  const handleSaveUser = async (form) => {
    try {
      setModalLoading(true)
      const method = modal?.user ? 'PATCH' : 'POST'
      const url = modal?.user ? `/api/users/${modal.user.id}` : '/api/users'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      toast.success(modal?.user ? 'Usuário atualizado!' : 'Usuário criado!')
      setModal(null)
      fetchUsers(selectedRole, selectedStatus, searchTerm)
      fetchAuditLogs()
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar usuário')
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja remover este usuário?')) return

    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      toast.success('Usuário removido!')
      fetchUsers(selectedRole, selectedStatus, searchTerm)
      fetchAuditLogs()
    } catch (error) {
      toast.error(error.message || 'Erro ao remover usuário')
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 8px 0',
          }}>
            Gerenciamento de Usuários
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
          }}>
            Total de usuários: {stats.total || 0}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleExport}
          >
            <Download size={18} />
            Exportar CSV
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowAudit(!showAudit)}
          >
            <History size={18} />
            Auditoria
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setModal({ user: null })}
          >
            <Plus size={18} />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Auditoria */}
      {showAudit && (
        <Card style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontWeight: '600' }}>
            📋 Últimas Ações
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#6b7280' }}>Ação</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#6b7280' }}>Admin</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#6b7280' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 5).map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', color: '#1f2937' }}>
                      {log.action.replace(/_/g, ' ').toUpperCase()}
                    </td>
                    <td style={{ padding: '8px', color: '#6b7280' }}>
                      {log.admin_user_id?.substring(0, 8)}...
                    </td>
                    <td style={{ padding: '8px', color: '#6b7280' }}>
                      {new Date(log.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {Object.entries(ROLES_CONFIG).map(([roleKey, roleCfg]) => (
          <Card key={roleKey}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: roleCfg.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <roleCfg.icon size={24} color={roleCfg.color} />
              </div>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: '0 0 4px 0',
                }}>
                  {roleCfg.label}
                </p>
                <p style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: roleCfg.color,
                  margin: 0,
                }}>
                  {stats[roleKey] || 0}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <FormField label="Buscar">
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none',
              }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Nome ou e-mail"
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  padding: '10px 12px',
                  paddingLeft: '36px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </FormField>

          <FormField label="Nível">
            <select
              value={selectedRole}
              onChange={(e) => handleRoleFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Todos</option>
              {Object.entries(ROLES_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Status">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </FormField>
        </div>
      </Card>

      {/* Tabela */}
      {loading ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <Loader2 size={32} style={{
            margin: '0 auto',
            color: '#3b82f6',
          }} />
          <p style={{ marginTop: '12px', color: '#6b7280' }}>Carregando...</p>
        </Card>
      ) : users.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <Users size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Nenhum usuário encontrado</p>
        </Card>
      ) : (
        <div style={{
          overflow: 'x-auto',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#ffffff',
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '16px', textAlign: 'left' }}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === users.length && users.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Nome</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>E-mail</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Nível</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: selectedUsers.has(user.id) ? '#f0f9ff' : 'transparent',
                }}>
                  <td style={{ padding: '16px' }}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleToggleUser(user.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {user.full_name}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <RoleBadge role={user.role} />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <StatusBadge active={user.is_active} />
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'right',
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end',
                  }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setModal({ user })}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <UserModal
          user={modal.user}
          onSave={handleSaveUser}
          onCancel={() => setModal(null)}
          loading={modalLoading}
        />
      )}
    </div>
  )
}
