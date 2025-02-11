/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo, useRef, useState } from "react";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface Event {
  day: number;
  month: number;
  year: number;
  time: string;
  title: string;
  description: string;
}

interface ContinuousCalendarProps {
  onClick?: (_day: number, _month: number, _year: number) => void;
  events?: Event[];
}

export const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({
  onClick,
  events = [],
}) => {
  const today = new Date();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState<Event[]>([]);

  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: `${index}`,
  }));

  const handlePrevYear = () => setYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setYear((prevYear) => prevYear + 1);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedMonth(monthIndex);
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    if (!onClick) {
      return;
    }
    setSelectedDay(day);
    setEventsForSelectedDay(
      events.filter(
        (event) =>
          event.day === day && event.month === month && event.year === year
      )
    );
    setShowModal(true);
  };

  const handleTodayClick = () => {
    setYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
  };

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
        {week.map(({ month, day }, dayIndex) => {
          const index = weekIndex * 7 + dayIndex;
          const isToday =
            today.getMonth() === month &&
            today.getDate() === day &&
            today.getFullYear() === year;

          // Check if the day has any events
          const dayEvents = events.filter(
            (event) =>
              event.day === day && event.month === month && event.year === year
          );

          return (
            <div
              key={`${month}-${day}`}
              ref={(el) => {
                dayRefs.current[index] = el;
              }}
              data-month={month}
              data-day={day}
              onClick={() => handleDayClick(day, month, year)}
              className={
                "relative m-[-0.5px] group aspect-square w-full grow cursor-pointer rounded-xl border font-medium transition-all hover:z-10 hover:border-brand-primary active:border-transparent sm:-m-px sm:size-20 sm:rounded-2xl sm:border-2 lg:size-36 lg:rounded-3xl 2xl:size-40"
              }
            >
              <span
                className={`absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs sm:size-6 sm:text-sm lg:left-2 lg:top-2 lg:size-8 lg:text-base ${
                  isToday ? "bg-brand-primary text-white" : "text-slate-800"
                }`}
              >
                {day}
              </span>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-3 text-xs sm:text-sm text-brand-primary">
                  {dayEvents.length}{" "}
                  {dayEvents.length > 1 ? "eventos" : "evento"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));
  }, [year, selectedMonth, events, handleDayClick, today]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl pb-10 text-slate-800">
      <div className="sticky -top-px w-full rounded-t-2xl px-5 pt-7 sm:px-8 sm:pt-8">
        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Select
              name=""
              value={`${selectedMonth}`}
              options={monthOptions}
              onChange={handleMonthChange}
            />
            <button
              onClick={handleTodayClick}
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 lg:px-5 lg:py-2.5"
            >
              Hoje
            </button>
            <button
              type="button"
              className="whitespace-nowrap rounded-lg bg-brand-primary px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none  sm:rounded-xl lg:px-5 lg:py-2.5"
            >
              + Novo Cronograma
            </button>
          </div>
          <div className="flex w-fit items-center justify-between">
            <button
              onClick={handlePrevYear}
              className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
            >
              <svg
                className="size-5 text-slate-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m15 19-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="min-w-16 text-center text-lg font-semibold sm:min-w-20 sm:text-xl">
              {year}
            </h1>
            <button
              onClick={handleNextYear}
              className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
            >
              <svg
                className="size-5 text-slate-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid w-full grid-cols-7 justify-between text-slate-500">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="w-full border-b border-slate-200 py-2 text-center font-semibold"
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-5 pt-4 sm:px-8 sm:pt-6">{generateCalendar}</div>

      {showModal && (
        <div
          className="fixed inset-0 flex z-10 items-center justify-center bg-gray-500 bg-opacity-50"
          onClick={closeModal} // Fecha o modal ao clicar fora
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()} // Impede que o clique no conteúdo do modal feche-o
          >
            <h2 className="text-xl font-semibold">
              Eventos no dia {selectedDay}
            </h2>
            <ul className="mt-4">
              {eventsForSelectedDay.map((event, index) => (
                <li key={index} className="mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>{event.time}</strong> - {event.title}
                  </p>
                  <p className="text-xs text-gray-500">{event.description}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 text-blue-500 hover:underline"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export interface SelectProps {
  name: string;
  value: string;
  label?: string;
  options: { name: string; value: string }[];
  onChange: (_event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export const Select = ({
  name,
  value,
  label,
  options = [],
  onChange,
  className,
}: SelectProps) => (
  <div className={`relative ${className}`}>
    {label && (
      <label htmlFor={name} className="mb-2 block font-medium text-slate-800">
        {label}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="cursor-pointer rounded-lg border border-gray-300 bg-white py-1.5 pl-2 pr-6 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:rounded-xl sm:py-2.5 sm:pl-3 sm:pr-8"
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);
