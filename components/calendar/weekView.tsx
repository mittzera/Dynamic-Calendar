import React, { useMemo } from "react";

interface WeekEvent {
  id: string;
  dia: number;
  mes: number;
  ano: number;
  hora: string;
  titulo: string;
  descricao: string;
  tipo_do_horario?: "estudo" | "exercicio";
  cor?: string; 
}

interface WeekViewProps {
  currentDate: Date;
  events: WeekEvent[];
}

/**
 * Componente de Visualização Semanal
 *
 * Este componente exibe os eventos do calendário em formato semanal:
 * - Mostra todos os dias da semana em colunas (domingo a sábado)
 * - Organiza eventos por dia e horário em uma grade
 * - Abrange horários desde as 6h até meia-noite
 * - Permite rolagem vertical para visualizar todos os horários
 *
 * Características visuais:
 * - Cabeçalho fixo com nomes dos dias da semana
 * - Coluna de horários fixa à esquerda durante rolagem horizontal
 * - Destaque para o dia atual com fundo colorido
 * - Eventos com cores personalizadas definidas em cada evento
 *
 * Cada evento mostra:
 * - Título do evento 
 * - Horário e descrição
 * - Cor personalizada para cada tipo de evento
 */

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events }) => {
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentDate]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 24; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  }, []);

  const eventsByDayAndTime = useMemo(() => {
    const eventMap: Record<string, WeekEvent[]> = {};

    weekDays.forEach((date) => {
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      eventMap[dateKey] = [];
    });

    events.forEach((event) => {
      const dateKey = `${event.ano}-${event.mes}-${event.dia}`;
      if (eventMap[dateKey]) {
        eventMap[dateKey].push(event);
      }
    });

    return eventMap;
  }, [weekDays, events]);

  const dayNames = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  return (
    <div
      className="week-view-container overflow-auto"
      style={{ maxHeight: "600px" }}
    >
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 border-b sticky top-0 z-10 bg-white">
          <div className="p-2 border-r bg-slate-50 font-medium text-slate-500">
            Hora
          </div>
          {weekDays.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={`p-2 text-center border-r ${
                  isToday ? "bg-brand-primary/10" : "bg-slate-50"
                }`}
              >
                <div className="font-medium">{dayNames[date.getDay()]}</div>
                <div
                  className={`text-sm ${
                    isToday ? "text-brand-primary font-bold" : "text-slate-500"
                  }`}
                >
                  {date.getDate()}/{date.getMonth() + 1}
                </div>
              </div>
            );
          })}
        </div>

        {timeSlots.map((timeSlot) => {
          return (
            <div
              key={timeSlot}
              className="grid grid-cols-8 border-b min-h-[80px]"
            >
              <div className="p-2 border-r bg-slate-50 text-sm font-medium flex items-start text-slate-600 sticky left-0">
                {timeSlot}
              </div>

              {weekDays.map((date, dayIndex) => {
                const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                const eventsAtTime = eventsByDayAndTime[dateKey]?.filter(
                  (event) => {
                    const eventHour = event.hora.split(":")[0];
                    return eventHour === timeSlot.split(":")[0];
                  }
                );

                return (
                  <div key={dayIndex} className="p-1 border-r relative">
                    {eventsAtTime &&
                      eventsAtTime.map((event, eventIndex) => (
                        <div
                          key={event.id || eventIndex}
                          className={`p-2 mb-1 rounded text-sm`}
                          style={{
                            backgroundColor: event.cor ? `${event.cor}20` : '#e0f2fe',
                            borderLeft: `2px solid ${event.cor || '#0ea5e9'}`,
                          }}
                        >
                          <div className="font-medium">{event.titulo}</div>
                          <div className="text-xs">
                            {event.hora} - {event.descricao}
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
