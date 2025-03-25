import React from "react";
import { CalendarEvent } from "./calendarGrid";

/**
 * Componente de Dia do Calendário
 * 
 * Este componente representa um único dia no calendário:
 * - Exibe o número do dia
 * - Mostra indicadores de eventos (pontos coloridos)
 * - Em telas maiores, exibe prévia dos eventos
 * - Destaca o dia atual com um círculo
 * 
 * Características visuais:
 * - Dias do mês atual: texto normal
 * - Dias de outros meses: texto cinza claro
 * - Dia atual: círculo de destaque
 * - Dia com eventos: indicadores coloridos com base na propriedade cor
 * 
 * Comportamento responsivo:
 * - Em telas pequenas: apenas o número e indicadores
 * - Em telas maiores: prévia dos eventos com horário e título
 */

interface DayProps {
  dia: number;
  mes: number;
  ano: number;
  calendarEvents: CalendarEvent[];
  onClick: (dia: number, mes: number, ano: number) => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  isCurrentMonth?: boolean;
}

export const Day: React.FC<DayProps> = ({
  dia,
  mes,
  ano,
  calendarEvents,
  onClick,
  isSelected = false,
  isDisabled = false,
  isCurrentMonth = true,
}) => {
  const today = new Date();
  const isToday =
    today.getDate() === dia &&
    today.getMonth() === mes &&
    today.getFullYear() === ano;

  const handleClick = () => {
    if (!isDisabled) {
      onClick(dia, mes, ano);
    }
  };

  const defaultColor = "#6366f1"; // Indigo

  return (
    <div
      className={`flex flex-col aspect-square
        rounded-md p-1 relative overflow-hidden border transition-colors
        ${
          isSelected
            ? "border-brand-primary bg-brand-primary/10"
            : isToday
            ? "border-slate-200"
            : "border-slate-200"
        }
        ${
          isDisabled
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5"
        }
        ${isCurrentMonth ? "" : "bg-slate-50 text-slate-400"}`}
      onClick={handleClick}
    >
      <div 
        className={`text-center sm:font-semibold font-bold ${
          isToday ? "relative z-10 text-white" : ""
        }`}
      >
        {dia}
        
        {isToday && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-primary -z-[1]" />
        )}
      </div>
      
      <div className="sm:hidden flex flex-col items-center justify-center h-full">
        {calendarEvents.length > 0 && (
          <div className="flex justify-center gap-1 w-full">
            {calendarEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center">
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: event.cor || defaultColor }}
                  title={event.titulo}
                ></span>
              </div>
            ))}
            {calendarEvents.length > 3 && (
              <span className="text-[9px] font-medium text-slate-500 ml-0.5">
                +{calendarEvents.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="hidden sm:block space-y-1 max-h-[150px] overflow-y-auto mt-1">
        {calendarEvents.slice(0, 3).map((event) => (
          <div
            key={event.id}
            title={event.titulo}
            className="flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium truncate shadow-sm"
            style={{ 
              borderLeftWidth: "2px",
              borderLeftStyle: "solid",
              borderLeftColor: event.cor || defaultColor,
              backgroundColor: `${event.cor || defaultColor}10`,
              color: event.cor || defaultColor
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mr-1"
              style={{ backgroundColor: event.cor || defaultColor }}
            ></span>
            <span className="font-semibold">
              {event.hora || ""}
            </span>
            {event.hora && <span className="mx-1">•</span>}
            <span className="truncate">{event.titulo}</span>
          </div>
        ))}
        {calendarEvents.length > 3 && (
          <div className="text-xs font-medium text-center py-0.5 bg-gray-100 rounded-sm border border-gray-200 shadow-sm">
            +{calendarEvents.length - 3}
          </div>
        )}
      </div>
    </div>
  );
};
