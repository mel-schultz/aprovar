'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Shield, Users, Search, Check, X, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES = {
  super_admin: { label: 'Super Admin', color: '#dc2626', bg: '#fee2e2' },
  atendimento: { label: 'Atendimento', color: '#3b82f6', bg: '#dbeafe' },
  cliente: { label: 'Cliente', color: '#8b5cf6', bg: '#ede9fe' }
}

export default function UsuariosManagement() {
  const [usuarios, setUsuarios] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async (search = '', role = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (role) params.append('role', role)

      const res = await fetch(`/api/admin/usuarios?${params.toString()}`)
      const result = await res.json()
      
      if (res.ok) {
        setUsuarios(result.data || [])
        setStats(result.stats || {})
      } else {
        toast.error(result.error || 'Erro ao carregar usuários')
      }
    } catch (error) {
      toast.error('Erro ao carregar usuários')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    fetchUsuarios(term, roleFilter)
  }

  const handleRoleFilter = (role) => {
    setRoleFilter(role)
    fetchUsuarios(searchTerm, role)
  }

  const handleSaveUsuario = async (formData) => {
    try {
      setModalLoading(true)
      const url = modal.usuario ? `/api/admin/usuarios/${modal.usuario.id}` : '/api/admin/usuarios'
      const method = modal.usuario ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (res.ok) {
        toast.success(modal.usuario ? 'Usuário atualizado!' : 'Usuário criado!')
        setModal(null)
        fetchUsuarios(searchTerm, roleFilter)
      } else {
        toast.error(result.error || 'Erro ao salvar')
      }
    } catch (error) {
      toast.error('Erro ao salvar usuário')
      console.error(error)
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteUsuario = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return

    try {
      const res = await fetch(`/api/admin/usuarios/${id}`, { method: 'DELETE' })
      const result = await res.json()

      if (res.ok) {
        toast.success('Usuário deletado!')
        fetchUsuarios(searchTerm, roleFilter)
      } else {
        toast.error(result.error || 'Erro ao deletar')
      }
    } catch (error) {
      toast.error('Erro ao deletar usuário')
      console.error(error)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Gerenciar Usuários</h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Total: {stats.total || 0} usuários
          </p>
        </div>
        <button
          onClick={() => setModal({ usuario: null })}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} />
          Novo Usuário
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {Object.entries(ROLES).map(([key, role]) => (
          <div key={key} style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{role.label}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: role.color }}>
              {stats[key] || 0}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Buscar</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
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
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Nível</label>
          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Todos</option>
            {Object.entries(ROLES).map(([key, role]) => (
              <option key={key} value={key}>{role.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Loader2 size={32} style={{ margin: '0 auto', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#666', marginTop: '12px' }}>Carregando...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <Users size={48} style={{ margin: '0 auto', color: '#d1d5db' }} />
          <p style={{ color: '#666', marginTop: '12px' }}>Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div style={{ borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Nome</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>E-mail</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Nível</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{usuario.nome}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>{usuario.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: ROLES[usuario.role].bg,
                      color: ROLES[usuario.role].color,
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {ROLES[usuario.role].label}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: usuario.ativo ? '#dcfce7' : '#fee2e2',
                      color: usuario.ativo ? '#16a34a' : '#dc2626',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {usuario.ativo ? <Check size={14} /> : <X size={14} />}
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setModal({ usuario })}
                      style={{
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                    {usuario.email !== 'mel.schultz@yahoo.com' && (
                      <button
                        onClick={() => handleDeleteUsuario(usuario.id)}
                        style={{
                          backgroundColor: '#fee2e2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <UsuarioModal
          usuario={modal.usuario}
          onSave={handleSaveUsuario}
          onClose={() => setModal(null)}
          loading={modalLoading}
        />
      )}
    </div>
  )
}

function UsuarioModal({ usuario, onSave, onClose, loading }) {
  const [form, setForm] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    senha: '',
    role: usuario?.role || 'cliente',
    telefone: usuario?.telefone || '',
    empresa: usuario?.empresa || '',
    ativo: usuario?.ativo ?? true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!form.nome.trim()) newErrors.nome = 'Nome obrigatório'
    if (!form.email.trim()) newErrors.email = 'E-mail obrigatório'
    if (!form.email.includes('@')) newErrors.email = 'E-mail inválido'
    if (!usuario && !form.senha) newErrors.senha = 'Senha obrigatória'
    if (form.senha && form.senha.length < 6) newErrors.senha = 'Mínimo 6 caracteres'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave(form)
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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
          {usuario ? 'Editar Usuário' : 'Novo Usuário'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Nome *</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: errors.nome ? '2px solid #dc2626' : '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {errors.nome && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.nome}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>E-mail *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!!usuario}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: errors.email ? '2px solid #dc2626' : '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box',
                opacity: usuario ? 0.6 : 1
              }}
            />
            {errors.email && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
              {usuario ? 'Nova Senha (deixe vazio para não alterar)' : 'Senha'} *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  paddingRight: '40px',
                  borderRadius: '8px',
                  border: errors.senha ? '2px solid #dc2626' : '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box'
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
                  color: '#999'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.senha && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.senha}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Nível *</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              {Object.entries(ROLES).map(([key, role]) => (
                <option key={key} value={key}>{role.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Telefone</label>
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Empresa</label>
            <input
              type="text"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
              />
              <span style={{ fontSize: '14px' }}>Ativo</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: loading ? 0.6 : 1
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {loading && <Loader2 size={16} />}
              {usuario ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
