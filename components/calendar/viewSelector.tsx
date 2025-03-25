import React from "react";

interface ViewSelectorProps {
  currentView: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
}

/**
 * Componente de Seletor de Visualização
 * 
 * Este componente permite ao usuário alternar entre diferentes visualizações do calendário:
 * - Visualização mensal: exibe o calendário em formato de grade com todos os dias do mês
 * - Visualização semanal: exibe uma semana por vez com horários detalhados
 * 
 * Características visuais:
 * - Botões tipo toggle para cada tipo de visualização
 * - Destaque visual para a visualização ativa (fundo branco, texto na cor primária)
 * - Visualizações inativas mostradas em cinza com efeito hover
 * - Estilo de grupo com bordas arredondadas e sombra sutil
 * 
 * O componente mantém um estado global da visualização atual através de suas props
 * e repassa as mudanças para o componente pai através da função onViewChange.
 */

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center justify-end mb-4">
      <div className="inline-flex bg-slate-100 rounded-md p-1 shadow-sm">
        <button
          onClick={() => onViewChange('month')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentView === 'month'
              ? 'bg-white text-brand-primary shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          Mês
        </button>
        <button
          onClick={() => onViewChange('week')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentView === 'week'
              ? 'bg-white text-brand-primary shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semana
        </button>
      </div>
    </div>
  );
};

export default ViewSelector;