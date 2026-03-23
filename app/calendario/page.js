"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachHourOfInterval,
  addDays,
  subDays,
  addMonths,
  startOfDay,
  endOfDay,
  startOfISOWeek,
  endOfISOWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * ==========================================
 * ADVANCED CALENDAR - BRYNTUM STYLE
 * ==========================================
 *
 * Professional calendar with:
 * - Month/Week/Day/Agenda views
 * - Drag & drop events
 * - Event creation/editing
 * - Dynamic colors
 * - Responsive design
 * - Dark/Light theme support
 */

const EVENT_TYPES = {
  APPROVAL: {
    id: "approval",
    label: "Aprovação",
    color: "#10b981",
    darkColor: "#059669",
    bg: "#d1fae5",
  },
  DEADLINE: {
    id: "deadline",
    label: "Prazo",
    color: "#ef4444",
    darkColor: "#dc2626",
    bg: "#fee2e2",
  },
  MEETING: {
    id: "meeting",
    label: "Reunião",
    color: "#3b82f6",
    darkColor: "#1d4ed8",
    bg: "#dbeafe",
  },
  DELIVERY: {
    id: "delivery",
    label: "Entrega",
    color: "#f59e0b",
    darkColor: "#d97706",
    bg: "#fef3c7",
  },
  OTHER: {
    id: "other",
    label: "Outro",
    color: "#6b7280",
    darkColor: "#4b5563",
    bg: "#f3f4f6",
  },
};

const VIEW_MODES = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
  AGENDA: "agenda",
};

export default function CalendarioBryntum() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Aprovação de Design",
      description: "Revisão de mockups",
      type: "APPROVAL",
      date: new Date(),
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 2,
      title: "Entrega de Entregáveis",
      description: "Arquivos finais",
      type: "DELIVERY",
      date: addDays(new Date(), 2),
      startTime: "14:00",
      endTime: "15:00",
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "OTHER",
    startTime: "09:00",
    endTime: "10:00",
    date: null,
  });
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const handleAddEvent = (date) => {
    setSelectedDate(date);
    setFormData({
      title: "",
      description: "",
      type: "OTHER",
      startTime: "09:00",
      endTime: "10:00",
      date: date,
    });
    setShowForm(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Título é obrigatório");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      date: formData.date || selectedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    setEvents([...events, newEvent]);
    setShowForm(false);
    setFormData({
      title: "",
      description: "",
      type: "OTHER",
      startTime: "09:00",
      endTime: "10:00",
      date: null,
    });
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm("Deletar evento?")) {
      setEvents(events.filter((e) => e.id !== eventId));
      setSelectedEvent(null);
    }
  };

  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnDay = (date) => {
    if (draggedEvent) {
      setEvents(
        events.map((e) =>
          e.id === draggedEvent.id ? { ...e, date: date } : e,
        ),
      );
      setDraggedEvent(null);
    }
  };

  const getFilteredEvents = useCallback(() => {
    if (filter === "ALL") return events;
    return events.filter((e) => e.type === filter);
  }, [events, filter]);

  const filteredEvents = getFilteredEvents();

  return (
    <div className="calendar-app">
      <Sidebar activePath="/calendario" />

      <main className="calendar-main">
        <PageHeader onAddEvent={() => handleAddEvent(new Date())} />

        {/* Toolbar */}
        <div className="calendar-toolbar">
          <div className="toolbar-left">
            <button
              onClick={() =>
                setCurrentDate(
                  subDays(currentDate, viewMode === VIEW_MODES.MONTH ? 30 : 7),
                )
              }
              className="toolbar-btn"
              title="Anterior"
            >
              ←
            </button>
            <h2 className="toolbar-title">
              {viewMode === VIEW_MODES.MONTH &&
                format(currentDate, "MMMM yyyy", { locale: ptBR })}
              {viewMode === VIEW_MODES.WEEK &&
                `Semana de ${format(startOfISOWeek(currentDate), "dd MMM", { locale: ptBR })}`}
              {viewMode === VIEW_MODES.DAY &&
                format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              {viewMode === VIEW_MODES.AGENDA && "Próximos Eventos"}
            </h2>
            <button
              onClick={() =>
                setCurrentDate(
                  addDays(currentDate, viewMode === VIEW_MODES.MONTH ? 30 : 7),
                )
              }
              className="toolbar-btn"
              title="Próximo"
            >
              →
            </button>
          </div>

          <div className="toolbar-center">
            {Object.entries(VIEW_MODES).map(([key, value]) => (
              <button
                key={value}
                onClick={() => setViewMode(value)}
                className={`view-btn${viewMode === value ? " active" : ""}`}
                title={key}
              >
                {key[0]}
              </button>
            ))}
          </div>

          <div className="toolbar-right">
            {Object.entries(EVENT_TYPES).map(([key, type]) => (
              <button
                key={key}
                onClick={() => setFilter(filter === key ? "ALL" : key)}
                className={`filter-btn${filter === key ? " active" : ""}`}
                style={{
                  backgroundColor: filter === key ? type.color : "transparent",
                  color: filter === key ? "#fff" : type.color,
                }}
                title={type.label}
              >
                {type.label}
              </button>
            ))}
            {filter !== "ALL" && (
              <button
                onClick={() => setFilter("ALL")}
                className="filter-btn clear"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === VIEW_MODES.MONTH && (
          <MonthView
            currentDate={currentDate}
            events={filteredEvents}
            onDateClick={handleAddEvent}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDropOnDay={handleDropOnDay}
            onSelectEvent={setSelectedEvent}
            selectedEvent={selectedEvent}
          />
        )}

        {viewMode === VIEW_MODES.WEEK && (
          <WeekView
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={setSelectedEvent}
            selectedEvent={selectedEvent}
          />
        )}

        {viewMode === VIEW_MODES.DAY && (
          <DayView
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={setSelectedEvent}
            selectedEvent={selectedEvent}
          />
        )}

        {viewMode === VIEW_MODES.AGENDA && (
          <AgendaView
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={setSelectedEvent}
            onDeleteEvent={handleDeleteEvent}
            selectedEvent={selectedEvent}
          />
        )}

        {/* Event Form Modal */}
        {showForm && (
          <EventFormModal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            onSubmit={handleSaveEvent}
            formData={formData}
            setFormData={setFormData}
            selectedDate={selectedDate}
          />
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onDelete={handleDeleteEvent}
            onEdit={() => {
              setFormData({
                title: selectedEvent.title,
                description: selectedEvent.description,
                type: selectedEvent.type,
                startTime: selectedEvent.startTime,
                endTime: selectedEvent.endTime,
                date: selectedEvent.date,
              });
              setSelectedDate(selectedEvent.date);
              setShowForm(true);
              setSelectedEvent(null);
            }}
          />
        )}
      </main>

      <GlobalStyles />
    </div>
  );
}

// ==========================================
// MONTH VIEW
// ==========================================
function MonthView({
  currentDate,
  events,
  onDateClick,
  onDragStart,
  onDragOver,
  onDropOnDay,
  onSelectEvent,
  selectedEvent,
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = monthStart.getDay();

  const getEventsByDate = (date) =>
    events.filter((e) => isSameDay(e.date, date));

  const today = new Date();

  return (
    <div className="calendar-view month-view">
      <div className="month-grid">
        {/* Weekday Headers */}
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="month-weekday">
            {day}
          </div>
        ))}

        {/* Empty cells */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="month-cell empty" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const dayEvents = getEventsByDate(day);
          const isToday = isSameDay(day, today);
          const isSelected =
            selectedEvent && isSameDay(day, selectedEvent.date);

          return (
            <div
              key={day.toISOString()}
              onDragOver={onDragOver}
              onDrop={() => onDropOnDay(day)}
              onClick={() => onDateClick(day)}
              className={`month-cell${isToday ? " today" : ""}${isSelected ? " selected" : ""}`}
            >
              <div className="month-cell-header">
                <span className="day-number">{day.getDate()}</span>
                {dayEvents.length > 0 && (
                  <span className="event-badge">{dayEvents.length}</span>
                )}
              </div>

              <div className="month-events">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, event)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(event);
                    }}
                    className="event-dot"
                    style={{
                      backgroundColor: EVENT_TYPES[event.type]?.color,
                    }}
                    title={event.title}
                  >
                    <span className="event-text">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="event-more">+{dayEvents.length - 2}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// WEEK VIEW
// ==========================================
function WeekView({ currentDate, events, onSelectEvent, selectedEvent }) {
  const weekStart = startOfISOWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsByTimeSlot = (day, hour) =>
    events.filter(
      (e) =>
        isSameDay(e.date, day) && parseInt(e.startTime.split(":")[0]) === hour,
    );

  return (
    <div className="calendar-view week-view">
      <div className="week-container">
        {/* Time column */}
        <div className="week-time-column">
          <div className="week-header-cell"></div>
          {hours.map((hour) => (
            <div key={hour} className="week-time-cell">
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Days columns */}
        {days.map((day) => (
          <div key={day.toISOString()} className="week-day-column">
            <div className="week-day-header">
              <div className="day-name">
                {format(day, "EEE", { locale: ptBR }).toUpperCase()}
              </div>
              <div className="day-date">{format(day, "dd")}</div>
            </div>

            <div className="week-slots">
              {hours.map((hour) => {
                const slotEvents = getEventsByTimeSlot(day, hour);
                return (
                  <div key={hour} className="week-slot">
                    {slotEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onSelectEvent(event)}
                        className="week-event"
                        style={{
                          backgroundColor: EVENT_TYPES[event.type]?.color,
                        }}
                      >
                        <div className="week-event-title">{event.title}</div>
                        <div className="week-event-time">
                          {event.startTime}-{event.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// DAY VIEW
// ==========================================
function DayView({ currentDate, events, onSelectEvent, selectedEvent }) {
  const dayEvents = events.filter((e) => isSameDay(e.date, currentDate));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="calendar-view day-view">
      <div className="day-container">
        <div className="day-timeline">
          {hours.map((hour) => (
            <div key={hour} className="day-hour">
              <div className="day-time">{String(hour).padStart(2, "0")}:00</div>
              <div className="day-divider"></div>
            </div>
          ))}
        </div>

        <div className="day-events-container">
          {dayEvents.length > 0 ? (
            dayEvents.map((event) => {
              const startHour = parseInt(event.startTime.split(":")[0]);
              const topPosition = startHour * 60 + 40;

              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="day-event"
                  style={{
                    backgroundColor: EVENT_TYPES[event.type]?.color,
                    top: `${topPosition}px`,
                  }}
                >
                  <div className="day-event-title">{event.title}</div>
                  <div className="day-event-time">
                    {event.startTime} - {event.endTime}
                  </div>
                  {event.description && (
                    <div className="day-event-desc">{event.description}</div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="day-empty">Nenhum evento agendado</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// AGENDA VIEW
// ==========================================
function AgendaView({
  currentDate,
  events,
  onSelectEvent,
  onDeleteEvent,
  selectedEvent,
}) {
  const upcomingEvents = events
    .filter((e) => e.date >= startOfDay(currentDate))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 20);

  return (
    <div className="calendar-view agenda-view">
      <div className="agenda-container">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="agenda-item"
            >
              <div
                className="agenda-color"
                style={{ backgroundColor: EVENT_TYPES[event.type]?.color }}
              />
              <div className="agenda-content">
                <div className="agenda-title">{event.title}</div>
                <div className="agenda-meta">
                  {format(event.date, "dd MMM yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}{" "}
                  • {EVENT_TYPES[event.type]?.label}
                </div>
                {event.description && (
                  <div className="agenda-desc">{event.description}</div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEvent(event.id);
                }}
                className="agenda-delete"
                title="Deletar"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <div className="agenda-empty">Nenhum evento futuro</div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MODALS
// ==========================================
function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  selectedDate,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Novo Evento</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              placeholder="Ex: Aprovação de Design"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                {Object.entries(EVENT_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                value={formData.date ? format(formData.date, "yyyy-MM-dd") : ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: new Date(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Início</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Fim</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              placeholder="Detalhes do evento..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EventDetailModal({ event, onClose, onDelete, onEdit }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="event-badge-type">
            {EVENT_TYPES[event.type]?.label}
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <h2>{event.title}</h2>

          <div className="event-info">
            <div className="info-row">
              <span className="label">Data:</span>
              <span>
                {format(event.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Horário:</span>
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </div>
            {event.description && (
              <div className="info-row">
                <span className="label">Descrição:</span>
                <span>{event.description}</span>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              onClick={() => onDelete(event.id)}
              className="btn btn-danger"
            >
              Deletar
            </button>
            <button onClick={onEdit} className="btn btn-secondary">
              Editar
            </button>
            <button onClick={onClose} className="btn btn-primary">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE COMPONENTS
// ==========================================
function PageHeader({ onAddEvent }) {
  return (
    <div className="page-header">
      <div>
        <h1>📅 Calendário</h1>
        <p>Gerencie eventos, aprovações e prazos</p>
      </div>
      <button onClick={onAddEvent} className="btn btn-primary btn-lg">
        + Novo Evento
      </button>
    </div>
  );
}

function Sidebar({ activePath }) {
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/clientes", label: "Clientes", icon: "🏢" },
    { href: "/entregaveis", label: "Entregáveis", icon: "📦" },
    { href: "/calendario", label: "Calendário", icon: "📅" },
    { href: "/aprovacoes", label: "Aprovações", icon: "✅" },
    { href: "/admin", label: "Admin", icon: "⚙️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="logo">
          <span className="logo-icon">✓</span>
          AprovaAí
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item${activePath === item.href ? " active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />
        <Link href="/" className="nav-item logout">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Sair</span>
        </Link>
      </div>
    </aside>
  );
}

// ==========================================
// STYLES
// ==========================================
function GlobalStyles() {
  return (
    <style>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .calendar-app {
        display: flex;
        min-height: 100vh;
        background: var(--color-canvas-default);
        color: var(--color-fg-default);
      }

      /* ========== SIDEBAR ========== */
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 256px;
        height: 100vh;
        background: var(--color-canvas-subtle);
        border-right: 1px solid var(--color-border-default);
        display: flex;
        flex-direction: column;
        z-index: 100;
        padding: 12px 0;
      }

      .sidebar-header {
        padding: 16px 12px 8px;
        border-bottom: 1px solid var(--color-border-muted);
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-fg-default);
        text-decoration: none;
        padding: 8px 12px;
        border-radius: 6px;
        transition: all 0.2s ease;
      }

      .logo:hover {
        background: var(--hover-bg);
      }

      .logo-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        background: var(--color-accent-subtle);
        color: var(--color-accent-fg);
        font-weight: 700;
        font-size: 12px;
      }

      .sidebar-nav {
        flex: 1;
        padding: 8px 0;
        overflow-y: auto;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        margin: 0 8px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        color: var(--color-fg-default);
        text-decoration: none;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .nav-item:hover {
        background: var(--hover-bg);
      }

      .nav-item.active {
        background: var(--color-accent-subtle);
        color: var(--color-accent-fg);
        font-weight: 600;
      }

      .nav-item.logout {
        color: var(--color-danger-fg);
      }

      .nav-item.logout:hover {
        background: var(--color-danger-subtle);
      }

      .nav-icon {
        font-size: 16px;
        flex-shrink: 0;
      }

      .nav-label {
        flex: 1;
        min-width: 0;
      }

      .sidebar-footer {
        padding: 8px 0;
        border-top: 1px solid var(--color-border-muted);
      }

      /* ========== MAIN ========== */
      .calendar-main {
        flex: 1;
        margin-left: 256px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .page-header {
        padding: 24px;
        border-bottom: 1px solid var(--color-border-muted);
        background: var(--color-canvas-default);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .page-header h1 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .page-header p {
        font-size: 14px;
        color: var(--color-fg-muted);
      }

      /* ========== TOOLBAR ========== */
      .calendar-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 12px 24px;
        border-bottom: 1px solid var(--color-border-muted);
        background: var(--color-canvas-default);
        flex-wrap: wrap;
      }

      .toolbar-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .toolbar-btn {
        padding: 6px 12px;
        background: var(--color-canvas-subtle);
        border: 1px solid var(--color-border-default);
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: var(--color-fg-default);
        transition: all 0.15s ease;
      }

      .toolbar-btn:hover {
        background: var(--hover-bg);
      }

      .toolbar-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-fg-default);
        min-width: 200px;
        text-align: center;
      }

      .toolbar-center {
        display: flex;
        gap: 8px;
      }

      .view-btn {
        width: 32px;
        height: 32px;
        padding: 0;
        background: var(--color-canvas-subtle);
        border: 1px solid var(--color-border-default);
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: var(--color-fg-default);
        transition: all 0.15s ease;
      }

      .view-btn:hover {
        background: var(--hover-bg);
      }

      .view-btn.active {
        background: var(--color-accent-fg);
        color: #fff;
        border-color: var(--color-accent-fg);
      }

      .toolbar-right {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .filter-btn {
        padding: 6px 12px;
        background: var(--color-canvas-subtle);
        border: 1px solid var(--color-border-default);
        border-radius: 20px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.15s ease;
      }

      .filter-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .filter-btn.clear {
        width: 32px;
        height: 32px;
        padding: 0;
        border-radius: 50%;
      }

      /* ========== CALENDAR VIEW ========== */
      .calendar-view {
        flex: 1;
        padding: 16px;
        overflow: auto;
        background: var(--color-canvas-default);
      }

      /* ========== MONTH VIEW ========== */
      .month-view {
        padding: 0;
      }

      .month-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background: var(--color-border-muted);
        border: 1px solid var(--color-border-default);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .month-weekday {
        background: var(--color-canvas-subtle);
        padding: 12px 8px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: var(--color-fg-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .month-cell {
        background: var(--color-canvas-default);
        padding: 8px;
        min-height: 120px;
        cursor: pointer;
        transition: all 0.15s ease;
        position: relative;
        display: flex;
        flex-direction: column;
      }

      .month-cell:hover {
        background: var(--hover-bg);
      }

      .month-cell.today {
        background: var(--color-accent-subtle);
        border: 2px solid var(--color-accent-fg);
      }

      .month-cell.selected {
        background: rgba(88, 166, 255, 0.1);
      }

      .month-cell.empty {
        background: var(--color-canvas-subtle);
        cursor: default;
      }

      .month-cell-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      .day-number {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-fg-default);
      }

      .event-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        height: 20px;
        padding: 0 4px;
        background: var(--color-accent-fg);
        color: #fff;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 600;
      }

      .month-events {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }

      .event-dot {
        padding: 4px 6px;
        border-radius: 4px;
        color: #fff;
        font-size: 11px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .event-dot:hover {
        transform: translateX(2px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }

      .event-text {
        display: block;
      }

      .event-more {
        font-size: 11px;
        color: var(--color-fg-muted);
        padding: 2px 6px;
        font-weight: 500;
      }

      /* ========== WEEK VIEW ========== */
      .week-view {
        padding: 0;
        overflow-x: auto;
      }

      .week-container {
        display: grid;
        grid-template-columns: 80px repeat(7, 1fr);
        gap: 1px;
        background: var(--color-border-muted);
        border: 1px solid var(--color-border-default);
        border-radius: 8px;
        overflow: hidden;
        min-width: 100%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .week-time-column {
        background: var(--color-canvas-subtle);
        border-right: 1px solid var(--color-border-default);
        display: flex;
        flex-direction: column;
      }

      .week-header-cell {
        height: 60px;
        border-bottom: 1px solid var(--color-border-muted);
      }

      .week-time-cell {
        flex: 1;
        padding: 8px;
        font-size: 11px;
        font-weight: 600;
        color: var(--color-fg-muted);
        text-align: center;
        min-height: 60px;
        border-bottom: 1px solid var(--color-border-muted);
      }

      .week-day-column {
        background: var(--color-canvas-default);
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--color-border-muted);
      }

      .week-day-header {
        padding: 8px;
        text-align: center;
        border-bottom: 1px solid var(--color-border-muted);
        background: var(--color-canvas-subtle);
      }

      .day-name {
        font-size: 11px;
        font-weight: 600;
        color: var(--color-fg-muted);
        text-transform: uppercase;
      }

      .day-date {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-fg-default);
        margin-top: 2px;
      }

      .week-slots {
        display: flex;
        flex-direction: column;
      }

      .week-slot {
        flex: 1;
        padding: 4px;
        min-height: 60px;
        border-bottom: 1px solid var(--color-border-muted);
        position: relative;
      }

      .week-event {
        padding: 4px 6px;
        border-radius: 4px;
        color: #fff;
        font-size: 10px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .week-event:hover {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        transform: scale(1.02);
      }

      .week-event-title {
        font-weight: 600;
        margin-bottom: 2px;
      }

      .week-event-time {
        font-size: 9px;
        opacity: 0.9;
      }

      /* ========== DAY VIEW ========== */
      .day-view {
        padding: 0;
      }

      .day-container {
        display: grid;
        grid-template-columns: 80px 1fr;
        gap: 1px;
        background: var(--color-border-muted);
        border: 1px solid var(--color-border-default);
        border-radius: 8px;
        overflow: hidden;
        min-height: calc(100vh - 200px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .day-timeline {
        background: var(--color-canvas-subtle);
        border-right: 1px solid var(--color-border-default);
        display: flex;
        flex-direction: column;
      }

      .day-hour {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 8px 4px;
        min-height: 60px;
        border-bottom: 1px solid var(--color-border-muted);
      }

      .day-time {
        font-size: 11px;
        font-weight: 600;
        color: var(--color-fg-muted);
      }

      .day-divider {
        width: 100%;
        height: 1px;
        background: var(--color-border-muted);
        margin-top: 4px;
      }

      .day-events-container {
        background: var(--color-canvas-default);
        position: relative;
        min-height: 100%;
      }

      .day-event {
        position: absolute;
        left: 8px;
        right: 8px;
        padding: 8px;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
        min-height: 60px;
        overflow: hidden;
      }

      .day-event:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .day-event-title {
        font-weight: 600;
        margin-bottom: 4px;
      }

      .day-event-time {
        font-size: 11px;
        opacity: 0.9;
        margin-bottom: 4px;
      }

      .day-event-desc {
        font-size: 11px;
        opacity: 0.8;
        line-height: 1.3;
      }

      .day-empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--color-fg-muted);
        font-size: 14px;
      }

      /* ========== AGENDA VIEW ========== */
      .agenda-view {
        padding: 0;
      }

      .agenda-container {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--color-border-default);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .agenda-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        border-bottom: 1px solid var(--color-border-muted);
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .agenda-item:hover {
        background: var(--hover-bg);
      }

      .agenda-item:last-child {
        border-bottom: none;
      }

      .agenda-color {
        flex: 0 0 4px;
        height: 80px;
        border-radius: 2px;
        margin-top: 2px;
      }

      .agenda-content {
        flex: 1;
        min-width: 0;
      }

      .agenda-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-fg-default);
        margin-bottom: 4px;
      }

      .agenda-meta {
        font-size: 12px;
        color: var(--color-fg-muted);
        margin-bottom: 6px;
      }

      .agenda-desc {
        font-size: 12px;
        color: var(--color-fg-muted);
        line-height: 1.4;
      }

      .agenda-delete {
        background: none;
        border: none;
        color: var(--color-danger-fg);
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        flex-shrink: 0;
        transition: all 0.15s ease;
      }

      .agenda-delete:hover {
        color: var(--color-danger-emphasis);
        transform: scale(1.2);
      }

      .agenda-empty {
        padding: 48px 24px;
        text-align: center;
        color: var(--color-fg-muted);
        font-size: 14px;
      }

      /* ========== MODAL ========== */
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
        border-radius: 8px;
        border: 1px solid var(--color-border-default);
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-border-muted);
      }

      .modal-header h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--color-fg-default);
      }

      .event-badge-type {
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        background: var(--color-accent-subtle);
        color: var(--color-accent-fg);
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }

      .modal-close {
        background: none;
        border: none;
        color: var(--color-fg-muted);
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        transition: color 0.15s ease;
      }

      .modal-close:hover {
        color: var(--color-fg-default);
      }

      .modal-body {
        padding: 16px 20px;
      }

      .modal-body h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-fg-default);
        margin-bottom: 16px;
      }

      .modal-form {
        padding: 16px 20px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: var(--color-fg-default);
        margin-bottom: 6px;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--color-border-default);
        border-radius: 6px;
        background: var(--color-canvas-default);
        color: var(--color-fg-default);
        font-size: 13px;
        font-family: inherit;
        transition: all 0.15s ease;
      }

      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: var(--color-accent-fg);
        box-shadow: 0 0 0 3px var(--color-accent-subtle);
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .event-info {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 16px;
      }

      .info-row {
        display: flex;
        gap: 12px;
        font-size: 13px;
      }

      .info-row .label {
        font-weight: 600;
        color: var(--color-fg-muted);
        flex: 0 0 100px;
      }

      .info-row span {
        color: var(--color-fg-default);
      }

      .form-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--color-border-muted);
      }

      /* ========== BUTTONS ========== */
      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .btn-primary {
        background: var(--color-accent-fg);
        color: #fff;
      }

      .btn-primary:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }

      .btn-secondary {
        background: var(--color-canvas-subtle);
        color: var(--color-fg-default);
        border: 1px solid var(--color-border-default);
      }

      .btn-secondary:hover {
        background: var(--hover-bg);
      }

      .btn-danger {
        background: var(--color-danger-emphasis);
        color: #fff;
      }

      .btn-danger:hover {
        opacity: 0.9;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }

      .btn-lg {
        padding: 10px 20px;
        font-size: 14px;
      }

      /* ========== RESPONSIVE ========== */
      @media (max-width: 768px) {
        .calendar-app {
          flex-direction: column;
        }

        .calendar-main {
          margin-left: 0;
        }

        .sidebar {
          position: fixed;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          width: 200px;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .month-grid {
          grid-template-columns: repeat(7, 1fr);
        }

        .month-cell {
          min-height: 80px;
          padding: 6px;
        }

        .day-number {
          font-size: 12px;
        }

        .month-events {
          gap: 2px;
        }

        .event-dot {
          padding: 2px 4px;
          font-size: 10px;
        }

        .week-container {
          grid-template-columns: 60px repeat(7, 1fr);
        }

        .toolbar-toolbar {
          gap: 8px;
        }

        .toolbar-title {
          min-width: auto;
          font-size: 14px;
        }

        .form-row {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 480px) {
        .calendar-toolbar {
          padding: 8px 12px;
          gap: 8px;
        }

        .toolbar-left {
          gap: 6px;
        }

        .toolbar-btn {
          padding: 4px 8px;
          font-size: 12px;
        }

        .toolbar-center {
          gap: 4px;
        }

        .view-btn {
          width: 28px;
          height: 28px;
          font-size: 11px;
        }

        .toolbar-right {
          gap: 4px;
        }

        .filter-btn {
          padding: 4px 8px;
          font-size: 11px;
        }

        .month-cell {
          min-height: 60px;
        }

        .month-weekday {
          padding: 8px 4px;
          font-size: 11px;
        }

        .day-number {
          font-size: 11px;
        }

        .event-badge {
          min-width: 16px;
          height: 16px;
          font-size: 9px;
        }

        .event-dot {
          padding: 2px 3px;
          font-size: 9px;
        }

        .event-more {
          font-size: 10px;
        }

        .page-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .page-header h1 {
          font-size: 20px;
        }

        .btn-lg {
          width: 100%;
          padding: 12px;
          justify-content: center;
        }
      }
    `}</style>
  );
}
