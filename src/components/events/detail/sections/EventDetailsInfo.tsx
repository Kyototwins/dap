
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types/events";
import { EventDateTimeSection } from "./EventDateTimeSection";
import { EventLocationSection } from "./EventLocationSection";
import { EventParticipantsCount } from "./EventParticipantsCount";
import { EventCategoryDisplay } from "./EventCategoryDisplay";
import { EventJoinButton } from "./EventJoinButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X } from "lucide-react";

interface EventDetailsInfoProps {
  event: Event;
  isCreator: boolean;
  isParticipating: boolean;
  isProcessing: boolean;
  onParticipate?: (eventId: string, eventTitle: string) => void;
  refreshEvents?: () => void;
}

export function EventDetailsInfo({
  event,
  isCreator,
  isParticipating,
  isProcessing,
  onParticipate,
  refreshEvents
}: EventDetailsInfoProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);
  const { toast } = useToast();

  const saveTitle = async () => {
    if (!event || !editedTitle.trim()) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .update({ title: editedTitle.trim() })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "Title updated",
        description: "Event title has been updated successfully."
      });
      
      setIsEditingTitle(false);
      // Refresh events if provided
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "Error updating title",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const cancelTitleEdit = () => {
    setEditedTitle(event.title);
    setIsEditingTitle(false);
  };

  return (
    <div className="space-y-3">
      {/* Event Title Section */}
      <div className="flex items-start gap-2">
        {isEditingTitle ? (
          <div className="flex-1 space-y-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-xl font-bold"
              placeholder="Event title"
            />
            <div className="flex gap-2">
              <Button
                onClick={saveTitle}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                onClick={cancelTitleEdit}
                size="sm"
                variant="outline"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
            {isCreator && (
              <Button
                onClick={() => setIsEditingTitle(true)}
                size="sm"
                variant="ghost"
                className="p-1 h-auto"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Event Category */}
      <EventCategoryDisplay category={event.category} />

      {/* Event Date and Time */}
      <EventDateTimeSection event={event} />

      {/* Event Location */}
      <EventLocationSection event={event} />

      {/* Participants Count */}
      <EventParticipantsCount 
        currentParticipants={event.current_participants}
        maxParticipants={event.max_participants}
      />

      {/* Join Button */}
      <EventJoinButton
        event={event}
        isCreator={isCreator}
        isParticipating={isParticipating}
        isProcessing={isProcessing}
        onParticipate={onParticipate}
      />
    </div>
  );
}
