import { Calendar } from "@/components/calendar/calendar";
import Card from "@/components/ui/Card";
import { ICalendarEvent } from "@/interfaces/Calendar";
import { IEvent } from "@/interfaces/Event";
import { eventService } from "@/services/EventsService";
import { generateColorFromTitle } from "@/utils/GenerateColor";

function formatDate(dateString: string): string {
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;

  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];

  return `${day}/${month}/${year}`;
}

async function getEvents(): Promise<ICalendarEvent[]> {
  try {
    const response = await eventService.getEvents();

    if (!response.ok) {
      throw new Error(`Erro ao buscar eventos: ${response.status}`);
    }

    const apiEvents: IEvent[] = await response.content;

    return apiEvents.map((event) => {
      const formattedDate = formatDate(event.date);
      const eventColor = generateColorFromTitle(event.title);

      if (formattedDate) {
        const [day, month, year] = formattedDate.split("/").map(Number);
        new Date(year, month - 1, day);
      }

      return {
        data: formattedDate,
        dia_semana: event.dayOfTheWeek,
        hora_inicio: event.startTime,
        hora_fim: event.endTime,
        titulo: event.title,
        descricao: event.description,
        cor: eventColor,
        _metadata: {
          criador: event.createdBy.username,
          avatar: event.createdBy.picture,
          criado_em: new Date(event.createdAt).toLocaleDateString("pt-BR"),
        },
      };
    });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
}

export default async function Home() {
  const eventos = await getEvents();

  if (!eventos || eventos.length === 0) {
    return (
      <section className="w-[90%] mx-auto mt-10">
        <Card>
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Sem eventos para exibir
            </h2>
            <p className="text-gray-500">
              Não há eventos agendados no momento.
            </p>
            <div className="mt-4"></div>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-[90%] mx-auto mt-10">
      <Card>
        <div className="p-4">
          <Calendar eventos={eventos} />
        </div>
      </Card>
    </section>
  );
}
