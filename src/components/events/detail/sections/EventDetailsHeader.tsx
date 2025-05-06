
import { Event } from "@/types/events";

interface EventDetailsHeaderProps {
  event: Event;
}

export function EventDetailsHeader({ event }: EventDetailsHeaderProps) {
  return (
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold">{event.title}</h2>
    </div>
  );
}
