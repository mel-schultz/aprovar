import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase, Task } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Calendar() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .not("due_date", "is", null)
        .order("due_date", { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      toast.error("Erro ao carregar tarefas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return tasks.filter((task) => task.due_date?.startsWith(dateStr));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendário</h1>
          <p className="text-muted-foreground mt-1">
            Visualize suas tarefas e prazos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={previousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold capitalize">{monthName}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center font-semibold text-sm text-muted-foreground"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    const dayTasks = day ? getTasksForDate(day) : [];
                    const isToday =
                      day &&
                      new Date().toDateString() ===
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        ).toDateString();

                    return (
                      <div
                        key={index}
                        className={`min-h-24 p-2 border rounded-lg transition-colors ${
                          day
                            ? isToday
                              ? "bg-blue-50 border-blue-300"
                              : "bg-background border-border hover:bg-secondary"
                            : "bg-muted"
                        }`}
                      >
                        {day && (
                          <>
                            <p
                              className={`text-sm font-medium mb-1 ${
                                isToday ? "text-blue-600" : "text-foreground"
                              }`}
                            >
                              {day}
                            </p>
                            <div className="space-y-1">
                              {dayTasks.slice(0, 2).map((task) => (
                                <div
                                  key={task.id}
                                  className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                                  title={task.title}
                                >
                                  {task.title}
                                </div>
                              ))}
                              {dayTasks.length > 2 && (
                                <p className="text-xs text-muted-foreground">
                                  +{dayTasks.length - 2} mais
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Próximas Tarefas</CardTitle>
                <CardDescription>
                  Tarefas com prazos próximos
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {tasks
                    .filter((task) => {
                      if (!task.due_date) return false;
                      const dueDate = new Date(task.due_date);
                      const today = new Date();
                      return dueDate >= today;
                    })
                    .sort((a, b) => {
                      const dateA = new Date(a.due_date || "");
                      const dateB = new Date(b.due_date || "");
                      return dateA.getTime() - dateB.getTime();
                    })
                    .slice(0, 5)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3 border rounded-lg hover:bg-secondary transition-colors"
                      >
                        <p className="text-sm font-medium truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(task.due_date || "").toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded capitalize ${
                              task.status === "concluida"
                                ? "bg-green-100 text-green-800"
                                : task.status === "em_progresso"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              task.priority === "urgente"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "alta"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}

                  {tasks.filter((task) => {
                    if (!task.due_date) return false;
                    const dueDate = new Date(task.due_date);
                    const today = new Date();
                    return dueDate >= today;
                  }).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma tarefa próxima
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Legenda</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-50 border border-blue-300"></div>
                  <span>Hoje</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-100"></div>
                  <span>Com tarefas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-background border border-border"></div>
                  <span>Sem tarefas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
