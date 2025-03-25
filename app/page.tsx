import { Calendar } from "@/components/calendar/calendar";
import Card from "@/components/Card";
import { eventosExemplo } from "@/components/data/data";



export default function Home() {
  return (
    <section className="w-[90%] mx-auto mt-10">
    <Card>
      <Calendar eventos={eventosExemplo}  />
    </Card>
    </section>
  );
}
