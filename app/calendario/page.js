'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  getDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isSameDay,
  parseISO,
  isToday,
  isBefore,
  isAfter,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ThemeToggle from '../../components/ThemeToggle'

// Cores predefinidas para eventos
const EVENT_COLORS = {
  blue: { bg: 'var(--color-accent-subtle)', text: 'var(--color-accent-fg)', border: 'var(--color-accent-muted)' },
  green: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  red: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  yellow: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  purple: { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' },
}

const EVENT_CATEGORIES = [
  { id: 'meeting', label: 'Reunião', color: 'blue' },
  { id: 'deadline', label: 'Prazo', color: 'red' },
  { id: 'review', label: 'Revisão', color: 'green' },
  { id: 'other', label: 'Outro', color: 'yellow' },
]

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // 'month' | 'week' | 'day'
  const [events, setEvents] = useState([
    {
      id: 1,
      titulo: 'Reunião com cliente',
      descricao: 'Apresentar protótipos',
      date: new Date(),
      time: '10:00',
      category: 'meeting',
      color: 'blue',
      duration: 60,
    },
  ])
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventData, setEventData] = useState({
    titulo: '',
    descricao: '',
    time: '09:00',
    category: 'meeting',
    duration: 60,
  })
  const [filterCategory, setFilterCategory] = useState('all')

  // Filtrar eventos por categoria
  const filteredEvents = useMemo(() => {
    if (filterCategory === 'all') return events
    return events.filter(e => e.category === filterCategory)
  }, [events, filterCategory])

  // Obter eventos de um dia específico
  const getDayEvents = useCallback((date) => {
    return filteredEvents.filter(e => isSameDay(parseISO(format(e.date, 'yyyy-MM-dd')), date))
  }, [filteredEvents])

  // Abrir modal para novo evento
  const handleAddEvent = (date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setEventData({ titulo: '', descricao: '', time: '09:00', category: 'meeting', duration: 60 })
    setShowEventModal(true)
  }

  // Abrir modal para editar evento
  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setSelectedDate(event.date)
    setEventData({
      titulo: event.titulo,
      descricao: event.descricao,
      time: event.time,
      category: event.category,
      duration: event.duration,
    })
    setShowEventModal(true)
  }

  // Salvar evento
  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (!eventData.titulo.trim()) return

    if (selectedEvent) {
      // Editar evento existente
      setEvents(events.map(ev =>
        ev.id === selectedEvent.id
          ? { ...ev, ...eventData, date: selectedDate }
          : ev
      ))
    } else {
      // Criar novo evento
      setEvents([...events, {
        ...eventData,
        id: Date.now(),
        date: selectedDate,
        color: EVENT_CATEGORIES.find(c => c.id === eventData.category)?.color || 'blue',
      }])
    }
    setShowEventModal(false)
    setEventData({ titulo: '', descricao: '', time: '09:00', category: 'meeting', duration: 60 })
  }

  // Deletar evento
  const handleDeleteEvent = (eventId) => {
    if (confirm('Tem certeza que deseja remover este evento?')) {
      setEvents(events.filter(e => e.id !== eventId))
      setShowEventModal(false)
    }
  }

  // Navegação de mês
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  // Renderizar visualização por mês
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const startOffset = getDay(monthStart)

    return (
      <div className="cal-grid">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="cal-weekday">{day}</div>
        ))}

        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`offset-${i}`} className="cal-day cal-day--empty" />
        ))}

        {days.map((day, idx) => {
          const dayEvents = getDayEvents(day)
          const isTodayDate = isToday(day)
          return (
            <div
              key={idx}
              onClick={() => handleAddEvent(day)}
              className={`cal-day${isTodayDate ? ' cal-day--today' : ''}`}
              title={`Adicionar evento em ${format(day, 'dd/MM/yyyy', { locale: ptBR })}`}
            >
              <span className={`cal-day-num${isTodayDate ? ' cal-day-num--today' : ''}`}>
                {day.getDate()}
              </span>
              <div className="cal-events">
                {dayEvents.slice(0, 2).map(ev => (
                  <div
                    key={ev.id}
                    className="cal-event-pill"
                    style={{
                      background: EVENT_COLORS[ev.color]?.bg,
                      color: EVENT_COLORS[ev.color]?.text,
                      borderLeft: `3px solid ${EVENT_COLORS[ev.color]?.text}`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditEvent(ev)
                    }}
                  >
                    {ev.titulo}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="cal-event-more">+{dayEvents.length - 2} mais</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Renderizar visualização por semana
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const hours = eachHourOfInterval({ start: startOfDay(new Date()), end: endOfDay(new Date()) })

    return (
      <div className="week-view">
        <div className="week-header">
          {weekDays.map(day => (
            <div key={format(day, 'yyyy-MM-dd')} className="week-day-header">
              <div className="week-day-name">{format(day, 'EEE', { locale: ptBR })}</div>
              <div className={`week-day-num${isToday(day) ? ' week-day-num--today' : ''}`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="week-grid">
          {weekDays.map(day => (
            <div key={format(day, 'yyyy-MM-dd')} className="week-column">
              {getDayEvents(day).map(ev => (
                <div
                  key={ev.id}
                  className="week-event"
                  style={{
                    background: EVENT_COLORS[ev.color]?.bg,
                    borderLeft: `4px solid ${EVENT_COLORS[ev.color]?.text}`,
                  }}
                  onClick={() => handleEditEvent(ev)}
                >
                  <div className="week-event-time">{ev.time}</div>
                  <div className="week-event-title">{ev.titulo}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <AppSidebar activePath="/calendario" />

      <main className="main-content">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div className="page-header-row">
            <div>
              <h1>Calendário</h1>
              <p>Visualize e gerencie seus eventos e prazos</p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="cal-controls">
          <div className="cal-nav">
            <button onClick={previousMonth} className="btn btn-secondary btn-icon" aria-label="Mês anterior">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
              </svg>
            </button>
            <h2 className="cal-month-title">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <button onClick={nextMonth} className="btn btn-secondary btn-icon" aria-label="Próximo mês">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
            <button onClick={goToToday} className="btn btn-secondary btn-sm">
              Hoje
            </button>
          </div>

          <div className="cal-filters">
            <div className="filter-group">
              <label className="filter-label">Visualização:</label>
              <div className="view-buttons">
                {['month', 'week', 'day'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`btn btn-sm ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Categoria:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todas</option>
                {EVENT_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
        </div>

        {/* UPCOMING EVENTS */}
        {filteredEvents.length > 0 && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="card-header">
              <h2 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                Próximos eventos
                <span className="count-badge">{filteredEvents.length}</span>
              </h2>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredEvents.slice(0, 5).map(ev => (
                <div
                  key={ev.id}
                  className="event-item"
                  onClick={() => handleEditEvent(ev)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="event-dot"
                    style={{ background: EVENT_COLORS[ev.color]?.text }}
                  />
                  <div className="event-content">
                    <span className="event-title">{ev.titulo}</span>
                    <span className="event-date">
                      {format(ev.date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                    {ev.descricao && <p className="event-desc">{ev.descricao}</p>}
                  </div>
                  <span className="event-category-badge">
                    {EVENT_CATEGORIES.find(c => c.id === ev.category)?.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENT MODAL */}
        {showEventModal && (
          <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {selectedEvent ? 'Editar evento' : 'Novo evento'} — {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="modal-close"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEvent}>
                <div className="form-group">
                  <label htmlFor="titulo-evento">Título <span className="required">*</span></label>
                  <input
                    id="titulo-evento"
                    type="text"
                    placeholder="Ex: Reunião com cliente"
                    value={eventData.titulo}
                    onChange={(e) => setEventData({ ...eventData, titulo: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="time-evento">Horário</label>
                    <input
                      id="time-evento"
                      type="time"
                      value={eventData.time}
                      onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duration-evento">Duração (min)</label>
                    <input
                      id="duration-evento"
                      type="number"
                      min="15"
                      step="15"
                      value={eventData.duration}
                      onChange={(e) => setEventData({ ...eventData, duration: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="category-evento">Categoria</label>
                  <select
                    id="category-evento"
                    value={eventData.category}
                    onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                  >
                    {EVENT_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="desc-evento">Descrição</label>
                  <textarea
                    id="desc-evento"
                    placeholder="Detalhes adicionais do evento..."
                    value={eventData.descricao}
                    onChange={(e) => setEventData({ ...eventData, descricao: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  {selectedEvent && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="btn btn-danger"
                    >
                      Deletar
                    </button>
                  )}
                  <div style={{ flex: 1 }} />
                  <button type="button" onClick={() => setShowEventModal(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedEvent ? 'Atualizar' : 'Criar'} evento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .app-shell { display: flex; min-height: 100vh; }
        .required { color: var(--color-danger-fg); }
        .form-actions { display: flex; gap: 8px; align-items: center; margin-top: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* Calendar controls */
        .cal-controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: var(--color-canvas-subtle);
          border: 1px solid var(--color-border-muted);
          border-radius: 6px;
        }

        .cal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .cal-month-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-fg-default);
          text-transform: capitalize;
          margin: 0;
          flex: 1;
          text-align: center;
        }

        .cal-filters {
          display: flex;
          gap: 24px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-fg-muted);
        }

        .view-buttons {
          display: flex;
          gap: 4px;
        }

        .filter-select {
          padding: 6px 8px;
          font-size: 13px;
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          background: var(--color-canvas-default);
          color: var(--color-fg-default);
          cursor: pointer;
        }

        .btn-icon {
          padding: 6px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Calendar grid */
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: var(--color-border-muted);
          border: 1px solid var(--color-border-muted);
          border-radius: 6px;
          overflow: hidden;
        }

        .cal-weekday {
          background: var(--color-canvas-subtle);
          padding: 8px 4px;
          text-align: center;
          font-size: 11px;
          font-weight: 600;
          color: var(--color-fg-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cal-day {
          background: var(--color-canvas-default);
          padding: 8px;
          min-height: 100px;
          cursor: pointer;
          transition: background-color 0.1s ease;
          border: 1px solid var(--color-border-muted);
        }

        .cal-day:hover {
          background: var(--hover-bg);
        }

        .cal-day--empty {
          background: var(--color-canvas-subtle);
          cursor: default;
        }

        .cal-day--today {
          background: var(--color-accent-subtle);
        }

        .cal-day-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          font-size: 12px;
          font-weight: 500;
          color: var(--color-fg-muted);
          border-radius: 50%;
          margin-bottom: 4px;
        }

        .cal-day-num--today {
          background: var(--color-accent-fg);
          color: #ffffff;
          font-weight: 600;
        }

        .cal-events {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cal-event-pill {
          font-size: 11px;
          font-weight: 500;
          padding: 4px 6px;
          border-radius: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .cal-event-pill:hover {
          opacity: 0.8;
        }

        .cal-event-more {
          font-size: 10px;
          color: var(--color-fg-muted);
          padding: 2px 4px;
          font-weight: 500;
        }

        /* Week view */
        .week-view {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--color-border-muted);
          border-radius: 6px;
          overflow: hidden;
        }

        .week-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: var(--color-border-muted);
          border-bottom: 2px solid var(--color-border-muted);
        }

        .week-day-header {
          background: var(--color-canvas-subtle);
          padding: 12px 8px;
          text-align: center;
        }

        .week-day-name {
          font-size: 11px;
          font-weight: 600;
          color: var(--color-fg-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .week-day-num {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-fg-default);
        }

        .week-day-num--today {
          background: var(--color-accent-fg);
          color: #ffffff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .week-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: var(--color-border-muted);
          min-height: 400px;
        }

        .week-column {
          background: var(--color-canvas-default);
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .week-event {
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .week-event:hover {
          opacity: 0.8;
        }

        .week-event-time {
          font-weight: 600;
          font-size: 11px;
          margin-bottom: 2px;
        }

        .week-event-title {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Card header */
        .card-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border-muted);
        }

        .count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          background: var(--color-neutral-muted);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          color: var(--color-fg-muted);
          margin-left: 8px;
        }

        /* Events list */
        .event-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--color-border-muted);
          transition: background-color 0.15s ease;
          padding: 12px;
          border-radius: 6px;
        }

        .event-item:hover {
          background: var(--hover-bg);
        }

        .event-item:last-child {
          border-bottom: none;
        }

        .event-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .event-content {
          flex: 1;
          min-width: 0;
        }

        .event-title {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin-bottom: 4px;
        }

        .event-date {
          display: block;
          font-size: 12px;
          color: var(--color-fg-muted);
          margin-bottom: 4px;
        }

        .event-desc {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 4px 0 0;
          line-height: 1.4;
        }

        .event-category-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          background: var(--color-canvas-subtle);
          border: 1px solid var(--color-border-default);
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          color: var(--color-fg-muted);
          white-space: nowrap;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 8px;
          padding: 24px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .modal-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin: 0;
        }

        .modal-close {
          background: transparent;
          border: none;
          font-size: 24px;
          color: var(--color-fg-muted);
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: background-color 0.15s ease;
        }

        .modal-close:hover {
          background: var(--hover-bg);
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-fg-default);
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          background: var(--color-canvas-default);
          color: var(--color-fg-default);
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-accent-fg);
          box-shadow: 0 0 0 3px var(--color-accent-subtle);
        }

        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        @media (max-width: 768px) {
          .cal-controls {
            flex-direction: column;
          }

          .cal-filters {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .cal-day {
            min-height: 80px;
            padding: 6px;
          }

          .modal-content {
            width: 95%;
            padding: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

function AppSidebar({ activePath }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--color-fg-default)', textDecoration: 'none', padding: '8px 16px 12px' }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          AprovaAí
        </Link>
      </div>
      <nav>
        <NavLink href="/dashboard" label="Dashboard" icon="dashboard" active={activePath === '/dashboard'} />
        <NavLink href="/clientes" label="Clientes" icon="building" active={activePath === '/clientes'} />
        <NavLink href="/entregaveis" label="Entregáveis" icon="package" active={activePath === '/entregaveis'} />
        <NavLink href="/calendario" label="Calendário" icon="calendar" active={activePath === '/calendario'} />
        <NavLink href="/aprovacoes" label="Aprovações" icon="check" active={activePath === '/aprovacoes'} />
        <NavLink href="/admin" label="Administração" icon="gear" active={activePath === '/admin'} />
      </nav>
      <div className="sidebar-footer">
        <ThemeToggle />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: 'var(--color-danger-fg)', textDecoration: 'none', marginTop: '4px', transition: 'background-color 0.15s ease' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z" />
          </svg>
          Sair
        </Link>
      </div>

      <style>{`
        .sidebar {
          width: 240px;
          background: var(--color-canvas-subtle);
          border-right: 1px solid var(--color-border-muted);
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow-y: auto;
          position: sticky;
          top: 0;
        }

        .sidebar-header {
          padding: 16px 0;
          border-bottom: 1px solid var(--color-border-muted);
        }

        .sidebar nav {
          flex: 1;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-footer {
          padding: 12px 8px;
          border-top: 1px solid var(--color-border-muted);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-fg-muted);
          text-decoration: none;
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .nav-item:hover {
          background: var(--hover-bg);
          color: var(--color-fg-default);
        }

        .nav-item.active {
          background: var(--color-accent-subtle);
          color: var(--color-accent-fg);
        }

        .nav-icon {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
          }
        }
      `}</style>
    </aside>
  )
}

function NavLink({ href, label, icon, active }) {
  return (
    <Link
      href={href}
      className={`nav-item${active ? ' active' : ''}`}
    >
      <span className="nav-icon">
        {icon === 'dashboard' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M1.75 1a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h12.5a.75.75 0 0 0 .75-.75V1.75a.75.75 0 0 0-.75-.75H1.75zM2.5 4h3V2.5h-3V4zm0 3h3V5.5h-3V7zm0 3h3v-1.5h-3V10zm4-6h3V2.5h-3V4zm0 3h3V5.5h-3V7zm0 3h3v-1.5h-3V10zm4-6h3V2.5h-3V4zm0 3h3V5.5h-3V7zm0 3h3v-1.5h-3V10z" />
          </svg>
        )}
        {icon === 'building' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M1.75 1a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h12.5a.75.75 0 0 0 .75-.75V1.75a.75.75 0 0 0-.75-.75H1.75zM2.5 4h2V2.5h-2V4zm3 0h2V2.5h-2V4zm3 0h2V2.5h-2V4zm3 0h2V2.5h-2V4zM2.5 7h2V5.5h-2V7zm3 0h2V5.5h-2V7zm3 0h2V5.5h-2V7zm3 0h2V5.5h-2V7zM2.5 10h2V8.5h-2V10zm3 0h2V8.5h-2V10zm3 0h2V8.5h-2V10zm3 0h2V8.5h-2V10z" />
          </svg>
        )}
        {icon === 'package' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1.5a.75.75 0 0 1 .75.75v1.5h3.5a1.75 1.75 0 0 1 1.75 1.75v7.5a1.75 1.75 0 0 1-1.75 1.75h-9.5A1.75 1.75 0 0 1 1 14v-7.5A1.75 1.75 0 0 1 2.75 4.5h3.5V2.25a.75.75 0 0 1 .75-.75zM2.5 5.5v8.5a.25.25 0 0 0 .25.25h9.5a.25.25 0 0 0 .25-.25V5.5z" />
          </svg>
        )}
        {icon === 'calendar' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0z" />
          </svg>
        )}
        {icon === 'check' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
        )}
        {icon === 'gear' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM7 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
            <path d="M8.5 1.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
            <path d="M8.5 14.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
            <path d="M1.5 8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
            <path d="M14.5 8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
          </svg>
        )}
      </span>
      {label}
    </Link>
  )
}
