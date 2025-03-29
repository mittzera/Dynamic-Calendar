import { Calendar } from "@/components/calendar/calendar";
import Card from "@/components/ui/Card";

// Interface para os dados da API real
interface ApiEvent {
  _id: string;
  id: string;
  date: string;  // "MM/DD/YYYY"
  startTime: string;
  endTime: string;
  dayOfTheWeek: string;
  title: string;
  description: string;
  createdBy: {
    username: string;
    _id: string;
    picture: string;
  };
  createdAt: string;
  updatedAt: string;
  updatedBy?: {
    username: string;
    _id: string;
    picture: string;
  };
}

// Interface para o formato de eventos do calendário
interface CalendarEvent {
  data?: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  titulo: string;
  descricao: string;
  cor?: string;
}

/**
 * Converte formato de data MM/DD/YYYY para YYYY-MM-DD
 */
function formatDate(dateString: string): string {
  // Verifica se a data está no formato MM/DD/YYYY
  const parts = dateString.split("/");
  if (parts.length !== 3) return dateString;
  
  const month = parts[0].padStart(2, "0");
  const day = parts[1].padStart(2, "0");
  const year = parts[2];
  
  return `${year}-${month}-${day}`;
}

/**
 * Gera uma cor aleatória baseada no nome do evento
 * para eventos que não têm cor definida
 */
function generateColorFromTitle(title: string): string {
  // Lista de cores distintas para eventos
  const colors = [
    "#4f46e5", // Indigo
    "#0ea5e9", // Sky blue
    "#0891b2", // Cyan
    "#0d9488", // Teal
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#84cc16", // Lime
    "#ef4444", // Red
    "#ea580c", // Orange
  ];
  
  // Usar primeiras letras do título para escolher uma cor determinística
  const hash = title.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}

async function getEvents(): Promise<CalendarEvent[]> {
  try {
    const response = await fetch('https://dynamiccalendarapi.onrender.com/schedule', {
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar eventos: ${response.status}`);
    }
    
    const apiEvents: ApiEvent[] = await response.json();
    
    return apiEvents.map(event => {
      // Convertendo data do formato MM/DD/YYYY para YYYY-MM-DD
      const formattedDate = formatDate(event.date);
      
      // Gerando cor baseada no título para eventos sem cor definida
      const eventColor = generateColorFromTitle(event.title);
      
      return {
        data: formattedDate,
        dia_semana: event.dayOfTheWeek,
        hora_inicio: event.startTime,
        hora_fim: event.endTime,
        titulo: event.title,
        descricao: event.description,
        cor: eventColor,
        // Adicionando metadados extras que podem ser úteis
        _metadata: {
          criador: event.createdBy.username,
          avatar: event.createdBy.picture,
          criado_em: new Date(event.createdAt).toLocaleDateString('pt-BR')
        }
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
    // Exibir um estado de fallback em vez de redirecionar para o notFound
    return (
      <section className="w-[90%] mx-auto mt-10">
        <Card>
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Sem eventos para exibir</h2>
            <p className="text-gray-500">Não há eventos agendados no momento.</p>
            <div className="mt-4">
            </div>
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
