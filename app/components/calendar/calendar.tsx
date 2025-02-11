"use client"
import React, { useState} from "react";
import CalendarGrid from "./calendarGrid";
import CalendarHeader from "./calendarHeader";
import EventModal from "./eventModal";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface Event {
  id: string;
  date: string;
  day: number;
  month: number;
  year: number;
  time: string;
  title: string;
  description: string;
}

interface CalendarProps {
  onClick?: () => void;
  events?: Event[];
}

export const Calendar: React.FC<CalendarProps> = ({
  events = [],
}) => {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
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
    setSelectedDay(day);
    setEventsForSelectedDay(
      events.filter(
        (event: Event) =>
          event.day === day && event.month === month && event.year === year
      )
    );
    setShowModal(true);
  };

  const handleTodayClick = () => {
    setYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  return (
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl p-10 text-slate-800 ">
      <CalendarHeader
        year={year}
        selectedMonth={selectedMonth}
        onPrevYear={handlePrevYear}
        onNextYear={handleNextYear}
        onTodayClick={handleTodayClick}
        onMonthChange={handleMonthChange}
        monthOptions={monthOptions}
      />
      <CalendarGrid
        year={year}
        selectedMonth={selectedMonth}
        events={events}
        onDayClick={handleDayClick}
      />
      {showModal && (
        <EventModal
          selectedDay={selectedDay}
          eventsForSelectedDay={eventsForSelectedDay}
          closeModal={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
