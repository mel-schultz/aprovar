"use client";

import { getDeliverablesWithClientName } from "../../lib/supabase/queries";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { createClient } from "../../lib/supabase/client";
import { Card, StatusBadge, EmptyState } from "../../components/ui";

const NETWORK_COLORS = {
  instagram: "#e1306c",
  facebook: "#1877f2",
  youtube: "#ff0000",
  tiktok: "#000",
};
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function ScheduleClient({ initialScheduled, userId }) {
  const supabase = createClient();
  const [current, setCurrent] = useState(new Date());
  const [scheduled, setScheduled] = useState(initialScheduled);
  const [selected, setSelected] = useState(null);

  const loadMonth = useCallback(
    async (date) => {
      const from = startOfMonth(date).toISOString();
      const to = endOfMonth(date).toISOString();
      const { data } = await getDeliverablesWithClientName(supabase, {
        profileId: userId,
        fields: "id,title,status,scheduled_at,network,client_id",
        filters: [
          ["scheduled_at", "gte", from],
          ["scheduled_at", "lte", to],
        ],
        orderBy: { column: "scheduled_at", ascending: true },
      }).then((r) => r);
      setScheduled(data || []);
    },
    [supabase, userId],
  );

  useEffect(() => {
    loadMonth(current);
  }, [current, loadMonth]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(current), { locale: ptBR }),
    end: endOfWeek(endOfMonth(current), { locale: ptBR }),
  });
  const postsOnDay = (day) =>
    scheduled.filter(
      (s) => s.scheduled_at && isSameDay(new Date(s.scheduled_at), day),
    );
  const selectedDayPosts = selected ? postsOnDay(selected) : [];

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 4 }}>Calendário de publicações</h1>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          Visualize e gerencie seus agendamentos.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 20,
          alignItems: "flex-start",
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => setCurrent((d) => subMonths(d, 1))}
              style={{
                background: "var(--surface-3)",
                border: "none",
                borderRadius: 8,
                padding: 8,
                cursor: "pointer",
                display: "flex",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <h2 style={{ fontSize: 17, textTransform: "capitalize" }}>
              {format(current, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <button
              onClick={() => setCurrent((d) => addMonths(d, 1))}
              style={{
                background: "var(--surface-3)",
                border: "none",
                borderRadius: 8,
                padding: 8,
                cursor: "pointer",
                display: "flex",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ padding: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                marginBottom: 8,
              }}
            >
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-3)",
                    padding: "4px 0",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 4,
              }}
            >
              {days.map((day) => {
                const posts = postsOnDay(day);
                const isToday = isSameDay(day, new Date());
                const inMonth = isSameMonth(day, current);
                const isSelected = selected && isSameDay(day, selected);
                return (
                  <div
                    key={day.toISOString()}
                    onClick={() =>
                      setSelected((d) => (d && isSameDay(d, day) ? null : day))
                    }
                    style={{
                      minHeight: 70,
                      padding: "6px 4px",
                      borderRadius: 10,
                      cursor: "pointer",
                      background: isSelected
                        ? "var(--brand-light)"
                        : isToday
                          ? "var(--surface-3)"
                          : "transparent",
                      border: isSelected
                        ? "2px solid var(--brand)"
                        : isToday
                          ? "2px solid var(--brand-light)"
                          : "2px solid transparent",
                      opacity: inMonth ? 1 : 0.35,
                      transition: "all .12s",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: isToday ? "var(--brand)" : "transparent",
                        color: isToday ? "#fff" : "var(--text)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: isToday ? 700 : 400,
                        marginBottom: 4,
                      }}
                    >
                      {format(day, "d")}
                    </div>
                    {posts.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          borderRadius: 4,
                          padding: "2px 4px",
                          marginBottom: 2,
                          background:
                            NETWORK_COLORS[p.network] || "var(--brand)",
                          color: "#fff",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.title}
                      </div>
                    ))}
                    {posts.length > 3 && (
                      <div style={{ fontSize: 10, color: "var(--text-3)" }}>
                        +{posts.length - 3}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
        <Card style={{ padding: 20 }}>
          {!selected ? (
            <EmptyState
              icon={Calendar}
              title="Selecione um dia"
              description="Clique em uma data para ver os posts agendados."
            />
          ) : (
            <div>
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>
                {format(selected, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              {selectedDayPosts.length === 0 ? (
                <p
                  style={{
                    color: "var(--text-3)",
                    fontSize: 13,
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  Nenhum post neste dia.
                </p>
              ) : (
                selectedDayPosts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      marginBottom: 10,
                    }}
                  >
                    <p
                      style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}
                    >
                      {p.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-2)",
                        marginBottom: 8,
                      }}
                    >
                      {p.clients?.name} ·{" "}
                      {format(new Date(p.scheduled_at), "HH:mm")}
                    </p>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <StatusBadge status={p.status} />
                      {p.network && (
                        <span
                          style={{
                            fontSize: 11,
                            background:
                              (NETWORK_COLORS[p.network] || "var(--brand)") +
                              "22",
                            color: NETWORK_COLORS[p.network] || "var(--brand)",
                            borderRadius: 4,
                            padding: "2px 6px",
                            fontWeight: 600,
                          }}
                        >
                          {p.network}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
