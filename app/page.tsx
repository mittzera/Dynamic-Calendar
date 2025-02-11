
import { Calendar } from "./components/calendar/calendar";
import Card from "./components/Card";
const events = [
  {
    id: "1",
    day: 29,
    month: 0,
    year: 2025,
    title: "Planning Meeting",
    description: "Meeting for planning project X",
    time: "10:00",
    date: new Date(2025, 0, 29, 10, 0).toISOString(),
  },
  {
    id: "2",
    day: 11,
    month: 1,
    year: 2025,
    title: "John's Birthday",
    description: "Celebration of John's birthday at his house.",
    time: "18:00",
    date: new Date(2025, 1, 11, 18, 0).toISOString(),
  },
  {
    id: "3",
    day: 25,
    month: 1,
    year: 2025,
    title: "Project Delivery",
    description: "Final delivery of project Z to the client.",
    time: "14:00",
    date: new Date(2025, 1, 25, 14, 0).toISOString(),
  },
  {
    id: "4",
    day: 15,
    month: 2,
    year: 2025,
    title: "React Lecture",
    description: "Lecture about the latest React updates at devconf event.",
    time: "09:00",
    date: new Date(2025, 2, 15, 9, 0).toISOString(),
  },
];

export default function Home() {
  return (
    <Card>
      <Calendar events={events} />
    </Card>
  );
}
