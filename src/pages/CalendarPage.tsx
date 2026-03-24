import { useEffect, useState, useCallback } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Approval } from '../types'
import ApprovalModal from '../components/approvals/ApprovalModal'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
})

const messages = {
  allDay: 'Dia todo',
  previous: '‹ Anterior',
  next: 'Próximo ›',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Nenhuma publicação neste período',
}

const statusColors: Record<string, string> = {
  draft: '#57606a',
  pending: '#e3b341',
  approved: '#1a7f37',
  rejected: '#cf222e',
  published: '#0969da',
}

export default function CalendarPage() {
  const { user } = useAuth()
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null)
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)

  const fetchEvents = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('approvals')
      .select('*, client:clients(name)')
      .not('scheduled_date', 'is', null)

    const evts = (data || []).map((a: any) => ({
      id: a.id,
      title: `${a.client?.name ? `[${a.client.name}] ` : ''}${a.title}`,
      start: new Date(a.scheduled_date),
      end: new Date(a.scheduled_date),
      resource: a,
    }))
    setEvents(evts)
  }, [user])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const eventStyleGetter = (event: any) => ({
    style: {
      backgroundColor: statusColors[event.resource.status] || '#0969da',
      borderRadius: '4px',
      border: 'none',
      color: '#fff',
      fontSize: '12px',
    },
  })

  const handleSelectEvent = (event: any) => {
    setSelectedApproval(event.resource)
    setApprovalModalOpen(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Calendário</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex' }}>
            {([Views.DAY, Views.WEEK, Views.MONTH] as const).map((v) => (
              <button
                key={v}
                className={`calendar-view-btn${view === v ? ' active' : ''}`}
                onClick={() => setView(v)}
              >
                {v === Views.DAY ? 'Dia' : v === Views.WEEK ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 16, height: 'calc(100vh - 200px)', minHeight: 500 }}>
          <Calendar
            localizer={localizer}
            events={events}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            culture="pt-BR"
            messages={messages}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            style={{ height: '100%' }}
            toolbar={true}
          />
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Object.entries(statusColors).map(([status, color]) => {
          const labels: Record<string, string> = { draft: 'Rascunho', pending: 'Pendente', approved: 'Aprovado', rejected: 'Rejeitado', published: 'Publicado' }
          return (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
              <span style={{ fontSize: 12, color: '#57606a' }}>{labels[status]}</span>
            </div>
          )
        })}
      </div>

      {approvalModalOpen && selectedApproval && (
        <ApprovalModal
          approval={selectedApproval}
          onClose={() => setApprovalModalOpen(false)}
          onSaved={() => { fetchEvents(); setApprovalModalOpen(false) }}
        />
      )}
    </div>
  )
}
