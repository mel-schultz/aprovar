'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ThemeToggle from '@/components/ThemeToggle'

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [eventData, setEventData] = useState({ titulo: '', descricao: '' })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startOffset = getDay(monthStart)

  const handleAddEvent = (date) => {
    setSelectedDate(date)
    setShowEventForm(true)
    setEventData({ titulo: '', descricao: '' })
  }

  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (!eventData.titulo.trim()) return
    setEvents([...events, { ...eventData, id: Date.now(), date: selectedDate }])
    setEventData({ titulo: '', descricao: '' })
    setShowEventForm(false)
  }

  const getDayEvents = (date) => {
    return events.filter(e => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
  }

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="app-shell">
      <AppSidebar activePath="/calendario" />

      <main className="main-content">
        {/* PAGE HEADER */}
        <div className="page-header">
          <h1>Calendário</h1>
          <p>Visualize e gerencie seus eventos e prazos</p>
        </div>

        {/* CALENDAR */}
        <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
          {/* MONTH NAVIGATION */}
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
          </div>

          {/* WEEKDAY HEADERS */}
          <div className="cal-grid">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="cal-weekday">{day}</div>
            ))}

            {/* OFFSET CELLS */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="cal-day cal-day--empty" />
            ))}

            {/* DAY CELLS */}
            {days.map((day, idx) => {
              const dayEvents = getDayEvents(day)
              const isToday = format(day, 'yyyy-MM-dd') === today
              return (
                <div
                  key={idx}
                  onClick={() => handleAddEvent(day)}
                  className={`cal-day${isToday ? ' cal-day--today' : ''}`}
                  title={`Adicionar evento em ${format(day, 'dd/MM/yyyy', { locale: ptBR })}`}
                >
                  <span className={`cal-day-num${isToday ? ' cal-day-num--today' : ''}`}>
                    {day.getDate()}
                  </span>
                  <div className="cal-events">
                    {dayEvents.map(ev => (
                      <div key={ev.id} className="cal-event-pill">
                        {ev.titulo}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* EVENT FORM */}
        {showEventForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>
              Novo evento — {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
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
                <button type="button" onClick={() => setShowEventForm(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar evento
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EVENTS LIST */}
        {events.length > 0 && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="card-header">
              <h2 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                Eventos
                <span className="count-badge">{events.length}</span>
              </h2>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {events.slice().reverse().map(ev => (
                <div key={ev.id} className="event-item">
                  <div className="event-dot" />
                  <div className="event-content">
                    <span className="event-title">{ev.titulo}</span>
                    <span className="event-date">
                      {format(ev.date, "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                    {ev.descricao && <p className="event-desc">{ev.descricao}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style>{`
        .app-shell { display: flex; min-height: 100vh; }
        .required { color: var(--color-danger-fg); }
        .form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }

        /* Calendar nav */
        .cal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .cal-month-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--color-fg-default);
          text-transform: capitalize;
          margin: 0;
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
          min-height: 80px;
          cursor: pointer;
          transition: background-color 0.1s ease;
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
          width: 22px;
          height: 22px;
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
          gap: 2px;
        }

        .cal-event-pill {
          font-size: 10px;
          font-weight: 500;
          background: var(--color-accent-fg);
          color: #ffffff;
          padding: 2px 5px;
          border-radius: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid var(--color-border-muted);
        }

        .event-item:last-child {
          border-bottom: none;
        }

        .event-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-accent-fg);
          margin-top: 4px;
          flex-shrink: 0;
        }

        .event-content {
          flex: 1;
          min-width: 0;
        }

        .event-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-fg-default);
          display: block;
          margin-bottom: 2px;
        }

        .event-date {
          font-size: 12px;
          color: var(--color-fg-muted);
          display: block;
        }

        .event-desc {
          font-size: 12px;
          color: var(--color-fg-muted);
          margin: 4px 0 0;
          line-height: 1.4;
        }
      `}</style>
    </div>
  )
}

function AppSidebar({ activePath }) {
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', d: 'M1 2.75A.75.75 0 0 1 1.75 2h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 1 7.75ZM1.75 12h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5ZM9 2.75A.75.75 0 0 1 9.75 2h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 2.75ZM9.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 7.75.75.75 0 0 1 9.75 7ZM9 12.75A.75.75 0 0 1 9.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 12.75Z' },
    { href: '/clientes', label: 'Clientes', d: 'M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h3.75a.75.75 0 0 1 0 1.5H1.75Z' },
    { href: '/entregaveis', label: 'Entregáveis', d: 'm8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.2.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.25.25 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z' },
    { href: '/calendario', label: 'Calendário', d: 'M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z' },
    { href: '/aprovacoes', label: 'Aprovações', d: 'M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z' },
    { href: '/admin', label: 'Administração', d: 'M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Z' },
  ]

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
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className={`nav-item${activePath === item.href ? ' active' : ''}`}>
            <span className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d={item.d} />
              </svg>
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <ThemeToggle />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: 'var(--color-danger-fg)', textDecoration: 'none', marginTop: '4px' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z" />
          </svg>
          Sair
        </Link>
      </div>
    </aside>
  )
}
