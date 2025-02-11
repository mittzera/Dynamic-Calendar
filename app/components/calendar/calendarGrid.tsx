import React, { useMemo } from "react";
import { Day } from "./day";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  day: number;
  month: number;
  year: number;
  // Add other properties of Event here
}

interface CalendarGridProps {
  year: number;
  selectedMonth: number;
  events: CalendarEvent[];
  onDayClick: (day: number, month: number, year: number) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  selectedMonth,
  events,
  onDayClick,
}) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const generateCalendar = useMemo(() => {
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    const startDayOfWeek = new Date(year, selectedMonth, 1).getDay();

    const daysInMonthArray: { month: number; day: number }[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      daysInMonthArray.push({
        month: selectedMonth - 1,
        day: 32 - startDayOfWeek + i,
      });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      daysInMonthArray.push({ month: selectedMonth, day });
    }

    const lastWeekDayCount = daysInMonthArray.length % 7;
    if (lastWeekDayCount > 0) {
      const extraDaysNeeded = 7 - lastWeekDayCount;
      for (let day = 1; day <= extraDaysNeeded; day++) {
        daysInMonthArray.push({ month: selectedMonth + 1, day });
      }
    }

    const calendarWeeks = [];
    for (let i = 0; i < daysInMonthArray.length; i += 7) {
      calendarWeeks.push(daysInMonthArray.slice(i, i + 7));
    }

    return calendarWeeks.map((week, weekIndex) => (
      <div className="flex w-full" key={weekIndex}>
        {week.map(({ month, day }) => (
          <Day
            key={`${month}-${day}`}
            day={day}
            month={month}
            year={year}
            calendarEvents={events.filter(
              (event: CalendarEvent) =>
                event.day === day &&
                event.month === month &&
                event.year === year
            )}
            onClick={onDayClick}
          />
        ))}
      </div>
    ));
  }, [year, selectedMonth, events, onDayClick]);

  return (
    <div className="w-full px-5 pt-4 sm:px-8 sm:pt-6">
      <div className="flex w-full">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="flex-1 text-center font-bold">
            {day}
          </div>
        ))}
      </div>
      {generateCalendar}
    </div>
  );
};

export default CalendarGrid;
