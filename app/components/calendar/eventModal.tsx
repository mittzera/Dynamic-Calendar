import React from "react";

interface Event {
  time: string;
  title: string;
  description: string;
}

interface EventModalProps {
  selectedDay: number | null;
  eventsForSelectedDay: Event[];
  closeModal: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  selectedDay,
  eventsForSelectedDay,
  closeModal,
}) => (
  <div
    className="fixed inset-0 flex z-10 items-center justify-center bg-gray-500 bg-opacity-50"
    onClick={closeModal}
  >
    <div
      className="bg-white p-6 rounded-lg max-w-lg w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-semibold">Events on day {selectedDay}</h2>
      <ul className="mt-4">
        {eventsForSelectedDay.map((event, index) => (
          <li key={index} className="mb-4">
            <p className="text-sm text-gray-700">
              <strong>{event.time}</strong> - {event.title}
            </p>
            <p className="text-xs text-gray-500">{event.description}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={closeModal}
        className="mt-4 text-blue-500 hover:underline"
      >
        Close
      </button>
    </div>
  </div>
);

export default EventModal;
