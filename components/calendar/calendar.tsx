'use client'
import React, { useState, useEffect } from "react";
import CalendarGrid from "./calendarGrid";
import EventModal from "./eventModal";
import ViewSelector from "./viewSelector";
import WeekView from "./weekView";
import WeekSelector from "./weekSelector";
import CreateEventModal from "./createEventModal";

const weekDayNames = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", 
  "Quinta-feira", "Sexta-feira", "Sábado"
];

interface InputEvent {
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  titulo: string;    // Alterado de "materia"
  descricao?: string; // Adicionado campo de descrição
  data?: string;     // YYYY-MM-DD
  cor?: string;      // Cor personalizada para o evento (opcional)
}

interface Event {
  id: string;
  date: string;
  dia: number;
  mes: number;
  ano: number;
  hora: string;
  titulo: string;
  descricao: string;
  cor?: string;    
}

interface CalendarProps {
  eventos?: InputEvent[];
}

/**
 * Componente principal do Calendário
 * 
 * Este componente gerencia a visualização e interação com o calendário:
 * - Exibe um calendário mensal com dias interativos
 * - Mostra eventos agendados em cada dia
 * - Permite navegação entre meses (anterior/próximo)
 * - Exibe detalhes dos eventos ao clicar em um dia
 * 
 * O componente recebe dados de eventos através da prop 'eventos' e os
 * processa para exibição no formato adequado para o calendário.
 */


export const Calendar: React.FC<CalendarProps> = ({
  eventos = [],
}) => {
  const today = React.useMemo(() => new Date(), []);
  const [ano, setAno] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDayMonth, setSelectedDayMonth] = useState<number | null>(null);
  const [selectedDayYear, setSelectedDayYear] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');
  const [currentWeekDate, setCurrentWeekDate] = useState<Date>(today);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  useEffect(() => {
    if (eventos && eventos.length > 0) {
      const mappedEvents = eventos.map((evento, index) => {
        let eventDate = today;
        let dia = today.getDate();
        let mes = today.getMonth();
        let anoEvento = today.getFullYear();

        if (evento.data) {
          const [day, month, year] = evento.data.split('/').map(Number);
          eventDate = new Date(year, month - 1, day);
          
          dia = eventDate.getDate();
          mes = eventDate.getMonth();
          anoEvento = eventDate.getFullYear();
        } else {
          const diaSemanaIndex = weekDayNames.findIndex(day => 
            day.toLowerCase().includes(evento.dia_semana.toLowerCase())
          );
          
          if (diaSemanaIndex !== -1) {
            const currentDay = today.getDay();
            const daysUntil = (diaSemanaIndex + 7 - currentDay) % 7;
            eventDate = new Date(today);
            eventDate.setDate(today.getDate() + daysUntil);
            
            dia = eventDate.getDate();
            mes = eventDate.getMonth();
            anoEvento = eventDate.getFullYear();
          }
        }
        
        return {
          id: `evento-${index}`,
          date: `${dia.toString().padStart(2, '0')}/${(mes + 1).toString().padStart(2, '0')}/${anoEvento}`,
          dia,
          mes,
          ano: anoEvento,
          hora: evento.hora_inicio,
          titulo: evento.titulo,
          descricao: evento.descricao || `${evento.hora_inicio} - ${evento.hora_fim}`,
          cor: evento.cor
        };
      });
      
      setCalendarEvents(mappedEvents);
    }
  }, [eventos, today]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setAno(ano - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setAno(ano + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleDayClick = (dia: number, mes: number, ano: number) => {
    setSelectedDay(dia);
    setSelectedDayMonth(mes);
    setSelectedDayYear(ano);
    
    const hasEvents = calendarEvents.some(
      event => 
        event.dia === dia && 
        event.mes === mes && 
        event.ano === ano
    );
    
    if (hasEvents) {
      setIsModalOpen(true);
    } else {
      const selectedDateObj = new Date(ano, mes, dia);
      openCreateModal(selectedDateObj);
    }
    
    console.log(`Dia selecionado: ${dia}/${mes + 1}/${ano}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
    setSelectedDayMonth(null);
    setSelectedDayYear(null);
  };

  const eventsForSelectedDay = calendarEvents.filter(
    event => 
      event.dia === selectedDay && 
      event.mes === selectedDayMonth && 
      event.ano === selectedDayYear
  );

  const handleTodayClick = () => {
    const today = new Date();
    setAno(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setCurrentWeekDate(today);
  };

  const handleViewChange = (view: 'month' | 'week') => {
    setCurrentView(view);
  };

  const handlePrevWeek = () => {
    const prevWeek = new Date(currentWeekDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeekDate(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeekDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeekDate(nextWeek);
  };

  interface EventFormData {
    date: string;
    dayOfTheWeek: string;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
  }

  const handleCreateEvent = (eventData: EventFormData) => {
    console.log('New event created:', eventData);
    const dateParts = eventData.date.split('/').map(Number);

    setCalendarEvents(prev => [
      ...prev,
      {
        id: `evento-${prev.length}`,
        date: eventData.date,
        dia: dateParts[0],
        mes: dateParts[1] - 1,
        ano: dateParts[2],
        hora: eventData.startTime,
        titulo: eventData.title,
        descricao: eventData.description,
      }
    ]);
    
    closeCreateModal();
  };

  const openCreateModal = (date?: Date) => {
    setSelectedDate(date || today);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedDate(null);
  };

  const handleCreateFromDay = () => {
    closeModal();
    
    if (selectedDay && selectedDayMonth !== null && selectedDayYear !== null) {
      const selectedDateObj = new Date(selectedDayYear, selectedDayMonth, selectedDay);
      openCreateModal(selectedDateObj);
    }
  };

  return (
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll p-1 pb-10 text-slate-800">
      <div className="my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 mb-4">
          <div className="order-1">
            {currentView === 'month' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevMonth}
                  className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
                >
                  <svg
                    className="size-4 sm:size-5 text-slate-800"
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
                <button
                  onClick={handleTodayClick}
                  type="button"
                  className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-slate-100 sm:px-3 sm:py-1.5 sm:text-sm"
                >
                  Hoje
                </button>
                <button
                  onClick={handleNextMonth}
                  className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
                >
                  <svg
                    className="size-4 sm:size-5 text-slate-800"
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
                <div className="ml-2 text-base sm:text-lg font-semibold">
                  <span className="capitalize text-brand-primary">
                    {new Date(ano, selectedMonth).toLocaleString('pt-BR', { month: 'long' })}
                  </span>{' '}
                  <span className="text-slate-700">{ano}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTodayClick}
                  type="button"
                  className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-slate-100 sm:px-3 sm:py-1.5 sm:text-sm"
                >
                  Hoje
                </button>
                <div className="ml-2 text-base sm:text-lg font-semibold">
                  <span className="text-slate-700">{ano}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="order-2 sm:flex sm:justify-end items-center gap-3">
            <button
              onClick={() => openCreateModal()}
              className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Novo Evento
            </button>
            <ViewSelector 
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          </div>
        </div>
        
        {currentView === 'week' && (
          <WeekSelector 
            currentDate={currentWeekDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
        )}
        
        {currentView === 'month' ? (
          <CalendarGrid
            ano={ano}
            selectedMonth={selectedMonth}
            events={calendarEvents}
            onDayClick={handleDayClick}
          />
        ) : (
          <WeekView 
            currentDate={currentWeekDate}
            events={calendarEvents}
          />
        )}
        
        {isModalOpen && selectedDay !== null && (
          <EventModal
            selectedDay={selectedDay}
            eventsForSelectedDay={eventsForSelectedDay}
            closeModal={closeModal}
            onCreateEventClick={handleCreateFromDay}
          />
        )}
        
        {isCreateModalOpen && (
          <CreateEventModal
            closeModal={closeCreateModal}
            onCreateEvent={handleCreateEvent}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  );
};
