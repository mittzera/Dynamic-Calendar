import React from "react";

/**
 * Componente Modal de Eventos
 * 
 * Este modal é exibido quando um dia com eventos é clicado:
 * - Mostra título com a data selecionada
 * - Lista todos os eventos do dia com detalhes
 * - Usa cores personalizadas para cada evento baseado na propriedade 'cor'
 * - Permite criar novo evento para o dia selecionado
 * 
 * Características:
 * - Cores dinâmicas baseadas na propriedade cor do evento
 * - Exibe hora, título e descrição de cada evento
 * - Permite fechar o modal clicando no botão ou fora dele
 * - Botão para criar novo evento para o dia selecionado
 */

interface Event {
  id?: string;
  hora: string;
  titulo: string;
  descricao: string;
  cor?: string; 
}

interface EventModalProps {
  selectedDay: number | null;
  eventsForSelectedDay: Event[];
  closeModal: () => void;
  onCreateEventClick?: () => void; 
}

const EventModal: React.FC<EventModalProps> = ({
  selectedDay,
  eventsForSelectedDay,
  closeModal,
  onCreateEventClick
}) => (
  <div
    className="fixed inset-0 flex z-10 items-center justify-center bg-gray-500 bg-opacity-50"
    onClick={closeModal}
  >
    <div
      className="bg-white p-6 rounded-lg max-w-lg w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-semibold">Eventos no dia {selectedDay}</h2>
      
      {eventsForSelectedDay.length === 0 ? (
        <div className="mt-4 text-center py-6">
          <p className="text-gray-500 mb-4">Não há eventos para este dia</p>
          {onCreateEventClick && (
            <button
              onClick={onCreateEventClick}
              className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Criar evento para este dia
            </button>
          )}
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {eventsForSelectedDay.map((event, index) => (
              <li 
                key={index} 
                className="p-3 rounded-lg border-l-4"
                style={{ 
                  backgroundColor: event.cor ? `${event.cor}20` : '#e0f2fe',  
                  borderLeftColor: event.cor || '#0ea5e9' 
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {event.hora} - {event.titulo}
                  </p>
                </div>
                <p className="text-sm text-slate-600 mt-1">{event.descricao}</p>
              </li>
            ))}
          </ul>
          
          {onCreateEventClick && (
            <div className="mt-4 text-center">
              <button
                onClick={onCreateEventClick}
                className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Criar novo evento para este dia
              </button>
            </div>
          )}
        </>
      )}
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
);

export default EventModal;
