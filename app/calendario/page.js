'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [eventData, setEventData] = useState({ titulo: '', descricao: '' })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handleAddEvent = (date) => {
    setSelectedDate(date)
    setShowEventForm(true)
  }

  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (!eventData.titulo.trim()) {
      alert('Digite um título para o evento')
      return
    }
    setEvents([...events, { ...eventData, id: Date.now(), date: selectedDate }])
    setEventData({ titulo: '', descricao: '' })
    setShowEventForm(false)
    alert('✅ Evento adicionado ao calendário!')
  }

  const getDayEvents = (date) => {
    return events.filter(e => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
  }

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <div className="main-content">
        <div>
          <h1>Calendário</h1>
          <p>Visualize e gerencie seus eventos</p>
        </div>

        <div className="card" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <button onClick={previousMonth} className="btn btn-secondary">
              ← Anterior
            </button>
            <h2 style={{ margin: '0' }}>
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <button onClick={nextMonth} className="btn btn-secondary">
              Próximo →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
          }}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
              <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px', color: '#cbd5e1' }}>
                {day}
              </div>
            ))}

            {days.map((day, idx) => {
              const dayEvents = getDayEvents(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              return (
                <div
                  key={idx}
                  onClick={() => handleAddEvent(day)}
                  style={{
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    padding: '12px',
                    minHeight: '120px',
                    cursor: 'pointer',
                    background: isCurrentMonth ? 'rgba(30, 41, 59, 0.3)' : 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '12px',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)'}
                  onMouseLeave={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)'}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                    {day.getDate()}
                  </div>
                  {dayEvents.map(ev => (
                    <div key={ev.id} style={{
                      fontSize: '11px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: 'white',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      marginBottom: '3px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {ev.titulo}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {showEventForm && (
          <div className="card">
            <h2>Novo Evento - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</h2>
            <form onSubmit={handleSaveEvent}>
              <div className="form-group">
                <label>Título do Evento *</label>
                <input
                  type="text"
                  placeholder="Ex: Reunião com cliente"
                  value={eventData.titulo}
                  onChange={(e) => setEventData({ ...eventData, titulo: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  placeholder="Detalhes adicionais do evento..."
                  value={eventData.descricao}
                  onChange={(e) => setEventData({ ...eventData, descricao: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEventForm(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Salvar Evento
                </button>
              </div>
            </form>
          </div>
        )}

        {events.length > 0 && (
          <div className="card">
            <h2>Próximos Eventos</h2>
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              {events.slice().reverse().map(ev => (
                <div key={ev.id} style={{
                  padding: '16px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 6px 0' }}>{ev.titulo}</h3>
                      <p style={{ margin: '0', fontSize: '13px', color: '#cbd5e1' }}>
                        📅 {format(ev.date, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      {ev.descricao && <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>{ev.descricao}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🎯 AprovaAí</h2>
      <nav style={{ marginBottom: '40px' }}>
        <NavLink href="/dashboard" label="Dashboard" icon="📊" />
        <NavLink href="/clientes" label="Clientes" icon="🏢" />
        <NavLink href="/entregaveis" label="Entregáveis" icon="📦" />
        <NavLink href="/calendario" label="Calendário" icon="📅" active />
        <NavLink href="/aprovacoes" label="Aprovações" icon="✅" />
        <NavLink href="/admin" label="Administração" icon="⚙️" />
      </nav>
      <Link href="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
        🚪 Sair
      </Link>
    </div>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link href={href} className={`nav-item ${active ? 'active' : ''}`} style={{ justifyContent: 'flex-start' }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <a style={{ flex: 1, textAlign: 'left' }}>{label}</a>
    </Link>
  )
}
