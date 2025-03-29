import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EventData {
  date: string;
  startTime: string;
  endTime: string;
  dayOfTheWeek: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

interface CreateEventModalProps {
  closeModal: () => void;
  onCreateEvent: (eventData: EventData) => void;
  selectedDate?: Date | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  closeModal,
  onCreateEvent,
  selectedDate,
}) => {
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(
    selectedDate || new Date()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDateForApi = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const [formData, setFormData] = useState({
    date: formatDateForApi(selectedDateObj),
    startTime: "",
    endTime: "",
    title: "",
    description: "",
  });

  const getDayOfWeek = (date: Date): string => {
    const weekDays = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    return weekDays[date.getDay()];
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDateObj(date);
      setFormData((prev) => ({
        ...prev,
        date: formatDateForApi(date),
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      dayOfTheWeek: getDayOfWeek(selectedDateObj),
      title: formData.title,
      description: formData.description,
      createdBy: "67e77c60852522ea5aec10c6",
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        "https://dynamiccalendarapi.onrender.com/schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error: ${response.status}`);
      }

      const createdEvent = await response.json();
      console.log("Event created successfully:", createdEvent);

      // Call the onCreateEvent prop with the created event data
      onCreateEvent(payload);
      closeModal();
    } catch (err) {
      console.error("Failed to create event:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create event. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  interface CustomInputProps {
    onClick?: () => void;
    value?: string;
  }

  const CustomDateInput = ({ onClick }: CustomInputProps) => (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between p-2 border border-gray-300 rounded-md bg-white"
    >
      <span>{formData.date}</span>
      <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex z-10 items-center justify-center bg-gray-500 bg-opacity-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Criar Novo Evento</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data do Evento
              </label>
              <div className="flex flex-col">
                <DatePicker
                  selected={selectedDateObj}
                  onChange={handleDateChange}
                  customInput={<CustomDateInput />}
                  dateFormat="dd/MM/yyyy"
                  calendarClassName="bg-white shadow-lg rounded-md border border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Data no formato DD/MM/YYYY
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hora de Início
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hora de Término
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Criando...
                </div>
              ) : (
                "Criar Evento"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
