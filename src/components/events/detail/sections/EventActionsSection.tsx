
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface EventActionsSectionProps {
  event: Event;
  isCreator: boolean;
  onDeleteEvent?: (eventId: string) => void;
}

export function EventActionsSection({ event, isCreator, onDeleteEvent }: EventActionsSectionProps) {
  if (!isCreator || !onDeleteEvent) return null;

  return (
    <div className="px-4 pb-4 border-t pt-4">
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDeleteEvent(event.id)}
        className="w-full"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Event
      </Button>
    </div>
  );
}
