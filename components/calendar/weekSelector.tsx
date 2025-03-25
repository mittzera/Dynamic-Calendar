import React from "react";

/**
 * Componente de Seletor de Semana
 * 
 * Permite ao usuário navegar entre semanas do calendário:
 * - Exibe a semana atual (por exemplo: "10-16 Março")
 * - Botões para semana anterior/próxima
 * - Integra-se com a visualização semanal
 */

interface WeekSelectorProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({
  currentDate,
  onPrevWeek,
  onNextWeek,
}) => {
  const startOfWeek = new Date(currentDate);
  const day = currentDate.getDay(); 
  startOfWeek.setDate(currentDate.getDate() - day); 

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const formatMonth = (date: Date) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[date.getMonth()];
  };

  return (
    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-md mb-4 border border-slate-200">
      <button
        onClick={onPrevWeek}
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

      <div className="text-base sm:text-lg font-semibold px-4">
        {startOfWeek.getMonth() === endOfWeek.getMonth() ? (
          <>
            {formatDate(startOfWeek)} - {formatDate(endOfWeek)} de {formatMonth(startOfWeek)}
          </>
        ) : (
          <>
            {formatDate(startOfWeek)} {formatMonth(startOfWeek)} - {formatDate(endOfWeek)} {formatMonth(endOfWeek)}
          </>
        )}
      </div>

      <button
        onClick={onNextWeek}
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
  );
};

export default WeekSelector;