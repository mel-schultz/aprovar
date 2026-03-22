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
    setEvents([...events, { ...eventData, id: Date.now(), date: selectedDate }])
    setEventData({ titulo: '', descricao: '' })
    setShowEventForm(false)
    alert('✅ Evento adicionado!')
  }

  const getDayEvents = (date) => {
    return events.filter(e => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#f5f5f5' }}>
        <h1>Calendário</h1>

        <div style={{ background: 'white', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="btn btn-secondary">
              ← Anterior
            </button>
            <h2>{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</h2>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="btn btn-secondary">
              Próximo →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
              <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px' }}>{day}</div>
            ))}

            {days.map((day, idx) => {
              const dayEvents = getDayEvents(day)
              return (
                <div
                  key={idx}
                  onClick={() => handleAddEvent(day)}
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    minHeight: '100px',
                    cursor: 'pointer',
                    background: isSameMonth(day, currentDate) ? 'white' : '#f9f9f9',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.background = isSameMonth(day, currentDate) ? 'white' : '#f9f9f9'}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{day.getDate()}</div>
                  {dayEvents.map(ev => (
                    <div key={ev.id} style={{ fontSize: '12px', background: '#0066cc', color: 'white', padding: '3px', borderRadius: '3px', marginBottom: '2px' }}>
                      {ev.titulo}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {showEventForm && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <h2>Novo Evento - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</h2>
            <form onSubmit={handleSaveEvent}>
              <input
                type="text"
                placeholder="Título"
                value={eventData.titulo}
                onChange={(e) => setEventData({ ...eventData, titulo: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '15px' }}
              />
              <textarea
                placeholder="Descrição"
                value={eventData.descricao}
                onChange={(e) => setEventData({ ...eventData, descricao: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '15px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">Salvar</button>
                <button type="button" onClick={() => setShowEventForm(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <div style={{ width: '250px', background: '#1a1a1a', color: 'white', padding: '20px', overflowY: 'auto', height: '100vh' }}>
      <h2 style={{ marginBottom: '30px' }}>🎯 AprovaAí</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link href="/dashboard" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link href="/clientes" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Clientes</Link>
        <Link href="/entregaveis" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Entregáveis</Link>
        <Link href="/calendario" style={{ padding: '10px', color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>Calendário</Link>
        <Link href="/aprovacoes" style={{ padding: '10px', color: 'white', textDecoration: 'none' }}>Aprovações</Link>
      </nav>
    </div>
  )
}
