import React from "react";

/**
 * Componente de Cabeçalho do Calendário
 * 
 * Este componente permite ao usuário:
 * - Navegar entre meses (botões anterior/próximo)
 * - Retornar ao mês atual (botão "Hoje")
 * - Visualizar o mês e ano atuais
 * 
 * Funções:
 * - onPrevMonth: Navega para o mês anterior
 * - onNextMonth: Navega para o próximo mês
 * - onTodayClick: Retorna para o mês atual
 * 
 * O cabeçalho exibe o nome do mês em português e o ano atual.
 */

interface CalendarHeaderProps {
  ano: number;
  selectedMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTodayClick: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  ano,
  selectedMonth,
  onPrevMonth,
  onNextMonth,
  onTodayClick,
}) => {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="px-2 sm:px-4 md:px-6 mb-4 flex w-full flex-wrap items-center justify-between gap-3 sm:gap-4 lg:gap-6">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={onTodayClick}
          type="button"
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-slate-100 sm:px-3 sm:py-1.5 sm:text-sm"
        >
          Hoje
        </button>
      </div>

      <div className="flex items-center">
        <button
          onClick={onPrevMonth}
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

        <div className="flex items-center px-3 sm:px-4">
          <h1 className="text-base sm:text-lg font-semibold">
            {monthNames[selectedMonth]} <span className="text-slate-500">{ano}</span>
          </h1>
        </div>

        <button
          onClick={onNextMonth}
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
      </div>
    </div>
  );
};

export default CalendarHeader;
