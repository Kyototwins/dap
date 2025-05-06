
import { Event } from "@/types/events";
import { Avatar } from "@/components/ui/avatar";

interface EventDetailsHeaderProps {
  event: Event;
}

export function EventDetailsHeader({ event }: EventDetailsHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Avatar className="h-10 w-10">
        <img
          src={event.creator?.avatar_url || "/placeholder.svg"}
          alt={`${event.creator?.first_name || 'Organizer'}'s avatar`}
        />
      </Avatar>
      <div>
        <h2 className="font-semibold text-lg">{event.title}</h2>
        <p className="text-sm text-gray-600">
          Organized by: {event.creator?.first_name} {event.creator?.last_name}
        </p>
      </div>
    </div>
  );
}
