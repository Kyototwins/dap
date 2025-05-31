
import { Event } from "@/types/events";
import { EventDateTimeSection } from "./EventDateTimeSection";
import { EventLocationSection } from "./EventLocationSection";
import { EventCategoryDisplay } from "./EventCategoryDisplay";
import { EventParticipantsCount } from "./EventParticipantsCount";
import { EventJoinButton } from "./EventJoinButton";

interface EventDetailsInfoProps {
  event: Event;
  isCreator: boolean;
  isParticipating?: boolean;
  isProcessing?: boolean;
  onParticipate?: (eventId: string, eventTitle: string) => void;
  refreshEvents?: () => void;
}

export function EventDetailsInfo({ 
  event, 
  isCreator, 
  isParticipating = false,
  isProcessing = false,
  onParticipate,
  refreshEvents
}: EventDetailsInfoProps) {
  return (
    <div className="space-y-2">
      <EventDateTimeSection 
        event={event} 
        isCreator={isCreator} 
        refreshEvents={refreshEvents} 
      />
      
      <EventLocationSection 
        event={event} 
        isCreator={isCreator} 
        refreshEvents={refreshEvents} 
      />
      
      <div className="flex items-center gap-2">
        <EventCategoryDisplay category={event.category} />
        
        {!isCreator && onParticipate && (
          <EventJoinButton
            isParticipating={isParticipating}
            isProcessing={isProcessing}
            onParticipate={onParticipate}
            eventId={event.id}
            eventTitle={event.title}
          />
        )}
      </div>
      
      <EventParticipantsCount 
        currentParticipants={event.current_participants}
        maxParticipants={event.max_participants}
      />
    </div>
  );
}
