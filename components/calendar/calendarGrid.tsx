import React, { useMemo } from "react";
import { Day } from "./day";

/**
 * Componente de Grade do Calendário
 * 
 * Este componente gera a estrutura visual do calendário:
 * - Cabeçalho com dias da semana (DOM, SEG, TER...)
 * - Grade com dias do mês atual
 * - Dias do mês anterior/próximo para completar as semanas
 * 
 * Principais funcionalidades:
 * - Gera dynamicamente a estrutura do mês atual
 * - Associa eventos aos dias correspondentes
 * - Gerencia a seleção e clique nos dias
 * - Controla a aparência visual de dias especiais (hoje, selecionado)
 * 
 * A função generateCalendar é usada para criar a estrutura completa
 * do calendário, incluindo dias de meses adjacentes quando necessário.
 */

export interface CalendarEvent {
  id: string;
  titulo: string;
  date: string;
  dia: number;
  mes: number;
  ano: number;
  hora?: string;
  descricao?: string;
  cor?: string;  
}

interface CalendarGridProps {
  ano: number;
  selectedMonth: number;
  events: CalendarEvent[];
  onDayClick: (dia: number, mes: number, ano: number) => void;
  selectedDays?: {dia: number, mes: number, ano: number}[];
  isDaySelected?: (dia: number, mes: number, ano: number) => boolean;
  isDayAvailable?: (dia: number, mes: number, ano: number) => boolean;
  firstSelectedDay?: Date | null;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  ano,
  selectedMonth,
  events,
  onDayClick,
  isDaySelected = () => false,
  isDayAvailable = () => true,
}) => {
  const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  
  const generateCalendar = useMemo(() => {
    const daysInMonth = new Date(ano, selectedMonth + 1, 0).getDate();
    const startDayOfWeek = new Date(ano, selectedMonth, 1).getDay();

    const daysInMonthArray: { mes: number; dia: number }[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      daysInMonthArray.push({
        mes: selectedMonth - 1,
        dia: 32 - startDayOfWeek + i,
      });
    }
    for (let dia = 1; dia <= daysInMonth; dia++) {
      daysInMonthArray.push({ mes: selectedMonth, dia });
    }

    const lastWeekDayCount = daysInMonthArray.length % 7;
    if (lastWeekDayCount > 0) {
      const extraDaysNeeded = 7 - lastWeekDayCount;
      for (let dia = 1; dia <= extraDaysNeeded; dia++) {
        daysInMonthArray.push({ mes: selectedMonth + 1, dia });
      }
    }

    const calendarWeeks = [];
    for (let i = 0; i < daysInMonthArray.length; i += 7) {
      calendarWeeks.push(daysInMonthArray.slice(i, i + 7));
    }

    return calendarWeeks.map((week, weekIndex) => (
      <div className="grid grid-cols-7 gap-1 w-full mb-1" key={weekIndex}>
        {week.map(({ mes, dia }) => {
          const isAvailable = isDayAvailable(dia, mes, ano);
          const isCurrentMonth = mes === selectedMonth;
          
          return (
            <Day
              key={`${mes}-${dia}`}
              dia={dia}
              mes={mes}
              ano={ano}
              calendarEvents={events.filter(
                (event: CalendarEvent) =>
                  event.dia === dia &&
                  event.mes === mes &&
                  event.ano === ano
              )}
              onClick={onDayClick}
              isSelected={isDaySelected(dia, mes, ano)}
              isDisabled={!isAvailable}
              isCurrentMonth={isCurrentMonth}
            />
          );
        })}
      </div>
    ));
  }, [ano, selectedMonth, events, isDaySelected, isDayAvailable, onDayClick]);

  return (
    <div className="w-full px-2 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-5 lg:px-8 lg:pt-6">
      <div className="grid grid-cols-7 gap-1 w-full mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center font-medium text-xs sm:text-sm md:text-base text-gray-700">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {generateCalendar}
      </div>
    </div>
  );
};

export default CalendarGrid;
