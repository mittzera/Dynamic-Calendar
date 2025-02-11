import React from "react";
import type { CalendarEvent } from "./calendarGrid";



interface DayProps {
  day: number;
  month: number;
  year: number;
  calendarEvents: CalendarEvent[];
  onClick: (day: number, month: number, year: number) => void;
}

export const Day: React.FC<DayProps> = ({
  day,
  month,
  year,
  calendarEvents,
  onClick,
}) => {
  const today = new Date();
  const isToday =
    today.getMonth() === month &&
    today.getDate() === day &&
    today.getFullYear() === year;

  return (
    <div
      onClick={() => onClick(day, month, year)}
      className={`relative m-[-0.5px] group aspect-square w-full grow cursor-pointer rounded-xl border font-medium transition-all hover:z-10 hover:border-brand-primary active:border-transparent sm:-m-px sm:size-20 sm:rounded-2xl sm:border-2 lg:size-36 lg:rounded-3xl 2xl:size-40`}
    >
      <span
        className={`absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs sm:size-6 sm:text-sm lg:left-2 lg:top-2 lg:size-8 lg:text-base ${
          isToday ? "bg-brand-primary text-white" : "text-slate-800"
        }`}
      >
        {day}
      </span>
      {calendarEvents.length > 0 && (
        <div className="absolute bottom-1 left-3 text-xs sm:text-sm text-brand-primary">
          {calendarEvents.length} {calendarEvents.length > 1 ? "Events" : "Event"}
        </div>
      )}
    </div>
  );
};
