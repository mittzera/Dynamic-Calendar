import React, { useState, useEffect } from "react";
import { Button } from "../buttons/Button";
import { api_contract } from "@/services/axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";

const weekDays = [
  { id: 0, name: "Domingo" },
  { id: 1, name: "Segunda-feira" },
  { id: 2, name: "Terça-feira" },
  { id: 3, name: "Quarta-feira" },
  { id: 4, name: "Quinta-feira" },
  { id: 5, name: "Sexta-feira" },
  { id: 6, name: "Sábado" },
];

interface CronogramaProps {
  onClick?: () => void;
}

interface Horario {
  inicio: string;
  fim: string;
  materia?: string;
}

interface DiaConfig {
  horariosEstudo: Horario[];
}

export const Cronograma: React.FC<CronogramaProps> = ({
  onClick,
}) => {
  // Estados para o cronograma de estudos
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [diasConfig, setDiasConfig] = useState<{ [key: number]: DiaConfig }>(
    {}
  );
  const [cronogramaNome, setCronogramaNome] = useState<string>("");
  const [cronogramaData, setCronogramaData] = useState<any[]>([]);

  const [showTip, setShowTip] = useState<boolean>(true);
  const [currentTip, setCurrentTip] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    switch (currentStep) {
      case 1:
        setCurrentTip("Selecione os dias da semana que você vai estudar.");
        break;
      case 2:
        setCurrentTip(
          "Defina os horários de estudo para cada dia selecionado."
        );
        break;
      case 3:
        setCurrentTip("Confira a grade do cronograma de estudos.");
        break;
      default:
        setCurrentTip("");
    }
    setFormError("");
  }, [currentStep]);

  const horasDisponiveis = Array.from({ length: 24 }, (_, i) => {
    const hora = i.toString().padStart(2, "0");
    return { value: `${hora}:00`, label: `${hora}:00` };
  });

  const handleDayToggle = (dayId: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayId)) {
        // Remove o dia e suas configurações
        const newDiasConfig = { ...diasConfig };
        delete newDiasConfig[dayId];
        setDiasConfig(newDiasConfig);

        return prev.filter((id) => id !== dayId);
      } else {
        // Adiciona o dia com configuração inicial de um horário
        setDiasConfig((prev) => ({
          ...prev,
          [dayId]: {
            horariosEstudo: [{ inicio: "08:00", fim: "09:00" }],
          },
        }));

        return [...prev, dayId].sort((a, b) => a - b);
      }
    });
  };

  const handleAddHorario = (dayId: number) => {
    setDiasConfig((prev) => {
      const diaCfg = prev[dayId];
      if (!diaCfg) return prev;

      const ultimoHorario =
        diaCfg.horariosEstudo[diaCfg.horariosEstudo.length - 1];
      // Pegar a hora final do último horário e usar como hora inicial do novo
      const [hora] = ultimoHorario.fim.split(":").map(Number);
      const novaHoraInicio = `${hora.toString().padStart(2, "0")}:00`;
      const novaHoraFim = `${(hora + 1) % 24}`.padStart(2, "0") + ":00";

      return {
        ...prev,
        [dayId]: {
          ...diaCfg,
          horariosEstudo: [
            ...diaCfg.horariosEstudo,
            { inicio: novaHoraInicio, fim: novaHoraFim },
          ],
        },
      };
    });
  };

  const handleRemoveHorario = (dayId: number, index: number) => {
    setDiasConfig((prev) => {
      const diaCfg = prev[dayId];
      if (!diaCfg || diaCfg.horariosEstudo.length <= 1) return prev;

      const novosHorarios = [...diaCfg.horariosEstudo];
      novosHorarios.splice(index, 1);

      return {
        ...prev,
        [dayId]: {
          ...diaCfg,
          horariosEstudo: novosHorarios,
        },
      };
    });
  };

  const handleHoraInicioChange = (
    dayId: number,
    index: number,
    value: string
  ) => {
    setDiasConfig((prev) => {
      const diaCfg = prev[dayId];
      if (!diaCfg) return prev;

      const novosHorarios = [...diaCfg.horariosEstudo];
      const [hora] = value.split(":").map(Number);
      const horaFim = `${(hora + 1) % 24}`.padStart(2, "0") + ":00";

      novosHorarios[index] = {
        inicio: value,
        fim: horaFim,
      };

      return {
        ...prev,
        [dayId]: {
          ...diaCfg,
          horariosEstudo: novosHorarios,
        },
      };
    });
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (selectedDays.length === 0) {
        setFormError("Selecione pelo menos um dia para continuar.");
        return;
      }

      if (!cronogramaNome.trim()) {
        setFormError("Digite um nome para o cronograma.");
        return;
      }

      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validar que todos os dias selecionados têm pelo menos 1 horário
      const diasSemHorario = selectedDays.filter(
        (day) => !diasConfig[day] || diasConfig[day].horariosEstudo.length === 0
      );

      if (diasSemHorario.length > 0) {
        setFormError(
          `Defina pelo menos um horário para todos os dias selecionados.`
        );
        return;
      }

      try {
        setFormError("");

        // Formatar dados para enviar
        const payload = {
          nome: cronogramaNome,
          dias_semana: selectedDays,
          configuracao_dias: diasConfig,
        };

        // Idealmente, chamar a API para obter as matérias sugeridas
        // const response = await api_contract.post("/cronogramas/preview", payload);

        // Simulando resposta
        const materiasDisponiveis = [
          "Matemática",
          "Português",
          "História",
          "Geografia",
          "Física",
          "Química",
          "Biologia",
        ];

        // Atualizar configuração de dias com matérias sugeridas para cada horário
        const novosDiasConfig = { ...diasConfig };
        const dadosCronograma: {
          dia_semana: string;
          hora_inicio: string;
          hora_fim: string;
          materia: string;
        }[] = [];

        for (const dayId of selectedDays) {
          const diaSemana = weekDays.find((d) => d.id === dayId)?.name || "";
          const horarios = diasConfig[dayId]?.horariosEstudo || [];

          // Atualizar cada horário com uma matéria sugerida
          novosDiasConfig[dayId] = {
            horariosEstudo: horarios.map((horario) => {
              // Escolher uma matéria aleatória
              const materia =
                materiasDisponiveis[
                  Math.floor(Math.random() * materiasDisponiveis.length)
                ];

              // Adicionar ao array para exibição na tabela
              dadosCronograma.push({
                dia_semana: diaSemana,
                hora_inicio: horario.inicio,
                hora_fim: horario.fim,
                materia: materia,
              });

              // Retornar o horário com a matéria
              return {
                ...horario,
                materia: materia,
              };
            }),
          };
        }

        // Atualizar o estado
        setDiasConfig(novosDiasConfig);
        setCronogramaData(dadosCronograma);
        setCurrentStep(3);
      } catch (error) {
        console.error("Erro ao obter sugestões de matérias:", error);
        setFormError(
          "Ocorreu um erro ao processar seu cronograma. Tente novamente."
        );
      }
    } else if (currentStep === 3) {
      try {
        setFormError("");

        // Enviar dados finais para a API
        const payload = {
          nome: cronogramaNome,
          dias_semana: selectedDays,
          configuracao_dias: diasConfig,
          calendario: cronogramaData.map((item) => ({
            dia_semana: item.dia_semana,
            hora_inicio: item.hora_inicio,
            hora_fim: item.hora_fim,
            materia: item.materia,
          })),
        };

        console.log("Payload enviado para a API:", payload);

        const response = await api_contract.post("/cronogramas", payload);

        console.log("Resposta da API:", response.data);
        alert("Cronograma criado com sucesso!");
        // window.location.href = "/dashboard/cronograma"; // Redirecionar para a página de cronogramas
      } catch (error) {
        console.error("Erro ao salvar cronograma:", error);
        setFormError("Erro ao salvar cronograma. Por favor, tente novamente.");
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <p className="mb-4 font-medium">
              Passo 1: Selecione os dias da semana
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {weekDays.map((day) => (
                <button
                  key={day.id}
                  onClick={() => handleDayToggle(day.id)}
                  type="button"
                  className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${
                      selectedDays.includes(day.id)
                        ? "border-brand-primary bg-brand-primary/10 font-medium"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {day.name}
                </button>
              ))}
            </div>

            {selectedDays.length > 0 && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p>
                  Dias selecionados: <strong>{selectedDays.length}</strong>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDays.map((dayId) => (
                    <span
                      key={dayId}
                      className="inline-block px-2 py-1 bg-white border border-yellow-300 rounded-md text-sm"
                    >
                      {weekDays.find((d) => d.id === dayId)?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case 2:
        return (
          <>
            <p className="mb-4 font-medium">
              Passo 2: Configure os horários de estudo
            </p>

            <div className="space-y-6">
              {selectedDays.map((dayId) => {
                const dia = weekDays.find((d) => d.id === dayId);
                const horarios = diasConfig[dayId]?.horariosEstudo || [];

                return (
                  <div key={dayId} className="border rounded-lg p-4 bg-white">
                    <h3 className="font-medium mb-3 text-brand-primary">
                      {dia?.name}
                    </h3>
                    <div className="space-y-3">
                      {horarios.map((horario, index) => (
                        <div
                          key={index}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <div>
                            <label className="block text-xs mb-1">
                              Horário de início
                            </label>
                            <select
                              className="border rounded-md text-sm p-1.5"
                              value={horario.inicio}
                              onChange={(e) =>
                                handleHoraInicioChange(
                                  dayId,
                                  index,
                                  e.target.value
                                )
                              }
                            >
                              {horasDisponiveis.map((hora) => (
                                <option key={hora.value} value={hora.value}>
                                  {hora.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mx-1 text-gray-500">→</div>

                          <div>
                            <label className="block text-xs mb-1">
                              Horário de término
                            </label>
                            <input
                              className="border rounded-md text-sm p-1.5 bg-gray-50"
                              value={horario.fim}
                              disabled
                            />
                          </div>

                          {horarios.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveHorario(dayId, index)}
                              className="ml-2 text-red-500 hover:text-red-700"
                              title="Remover horário"
                            >
                              <IoCloseCircleOutline size={22} />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddHorario(dayId)}
                        className="flex items-center gap-1 mt-2 text-brand-primary hover:text-brand-primary/80"
                      >
                        <IoMdAddCircleOutline size={20} />
                        <span className="text-sm">Adicionar horário</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <p className="mb-4 font-medium">
              Passo 3: Verifique seu cronograma
            </p>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
              <h3 className="font-medium mb-2">Resumo do seu cronograma:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Nome: <strong>{cronogramaNome}</strong>
                </li>
                <li>
                  Dias de estudo: <strong>{selectedDays.length}</strong>
                </li>
                <li>
                  Total de horários: <strong>{cronogramaData.length}</strong>
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              {/* Agrupar por dia da semana */}
              {Array.from(
                new Set(cronogramaData.map((item) => item.dia_semana))
              ).map((diaSemana) => {
                const horariosDoDia = cronogramaData.filter(
                  (item) => item.dia_semana === diaSemana
                );

                return (
                  <div key={diaSemana} className="overflow-x-auto">
                    <div className="bg-gray-100 p-3 rounded-t-lg border border-gray-300">
                      <h3 className="font-medium text-lg text-brand-primary">
                        {diaSemana}
                      </h3>
                    </div>

                    <table className="min-w-full border border-gray-300 text-left text-xs sm:text-sm">
                      <thead className="bg-brand-primary text-white">
                        <tr>
                          <th className="border px-2 py-2 sm:px-4">Início</th>
                          <th className="border px-2 py-2 sm:px-4">Fim</th>
                          <th className="border px-2 py-2 sm:px-4">Matéria</th>
                        </tr>
                      </thead>
                      <tbody>
                        {horariosDoDia.map((item, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="border px-2 py-2 sm:px-4">
                              {item.hora_inicio}
                            </td>
                            <td className="border px-2 py-2 sm:px-4">
                              {item.hora_fim}
                            </td>
                            <td className="border px-2 py-2 sm:px-4 font-medium">
                              {item.materia}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </>
        );
    }
  };

  return (
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll p-1 pb-10 text-slate-800">
      <div className="my-4">
        <p className="uppercase text-lg sm:text-xl font-bold text-brand-primary mb-2 sm:mb-4">
          Criação de Cronograma
        </p>

        {currentStep === 1 && (
          <div className="flex items-center gap-2 sm:gap-4 mb-6">
            <input
              type="text"
              value={cronogramaNome}
              onChange={(e) => setCronogramaNome(e.target.value)}
              placeholder="Digite o nome do cronograma... *"
              className="p-2 sm:p-3 rounded-lg border border-gray-300 w-full max-w-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            />
          </div>
        )}

        {formError && (
          <div className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200 text-red-700">
            <p>{formError}</p>
          </div>
        )}

        {showTip && currentTip && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-start">
            <div className="text-blue-500 mr-2 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-blue-800">{currentTip}</p>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="text-blue-500 hover:text-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        <div className="mb-6">{renderStepContent()}</div>

        <div className="flex justify-between mt-8">
          <Button
            variant="gray"
            onClick={currentStep === 1 ? () => {} : handlePreviousStep}
            disabled={currentStep === 1}
          >
            {currentStep === 1 ? "CANCELAR" : "VOLTAR"}
          </Button>

          <Button variant="primary" onClick={handleNextStep}>
            {currentStep === 3 ? "FINALIZAR" : "AVANÇAR"}
          </Button>
        </div>
      </div>
    </div>
  );
};
