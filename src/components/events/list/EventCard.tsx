
import { Card } from "@/components/ui/card";
import { Event } from "@/types/events";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EventCardImage } from "./EventCardImage";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardDetails } from "./EventCardDetails";
import { EventCardActions } from "./EventCardActions";
import { categoryTranslationMap } from "../utils/categoryTranslation";

interface EventCardProps {
  event: Event;
  isParticipating: boolean;
  onJoin: (eventId: string, eventTitle: string) => void;
  onDelete: (eventId: string) => void;
  onCardClick: (event: Event) => void;
  isProcessing?: boolean;
}

export function EventCard({ 
  event, 
  isParticipating, 
  onJoin,
  onDelete, 
  onCardClick, 
  isProcessing = false 
}: EventCardProps) {
  const [isCreator, setIsCreator] = useState(false);
  const [effectiveIsParticipating, setEffectiveIsParticipating] = useState(isParticipating);
  
  // Check if user is creator and update participation status
  useEffect(() => {
    const checkIfCreator = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user && event.creator_id === data.user.id) {
        setIsCreator(true);
        // Auto-set creators as participating
        setEffectiveIsParticipating(true);
      } else {
        setEffectiveIsParticipating(isParticipating);
      }
    };
    
    checkIfCreator();
  }, [event.creator_id, isParticipating]);

  // Update participation status when the isParticipating prop changes
  useEffect(() => {
    if (!isCreator) {
      setEffectiveIsParticipating(isParticipating);
    }
  }, [isParticipating, isCreator]);

  const displayCategory = categoryTranslationMap[event.category] || event.category;
  const eventDate = new Date(event.date);
  const currentDate = new Date();
  const isPastEvent = eventDate < currentDate;
  
  // Use actual current_participants from database
  const currentParticipants = event.current_participants;
  
  // Determine if the button should be disabled
  const isDisabled = isProcessing || 
    isPastEvent || 
    (!effectiveIsParticipating && event.max_participants !== 0 && currentParticipants >= event.max_participants);

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled && !effectiveIsParticipating) {
      onJoin(event.id, event.title);
    }
  };

  return (
    <Card 
      className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow rounded-xl border-[#e4e4e7] relative ${isPastEvent ? 'opacity-70' : ''}`}
      onClick={() => onCardClick(event)}
    >
      <EventCardImage 
        imageUrl={event.image_url} 
        title={event.title}
        isPastEvent={isPastEvent}
      />
      
      <div className="p-4">
        <EventCardHeader 
          title={event.title}
          creatorFirstName={event.creator?.first_name}
          creatorLastName={event.creator?.last_name}
          creatorAvatarUrl={event.creator?.avatar_url}
        />
        
        <EventCardDetails 
          description={event.description}
          category={event.category}
          displayCategory={displayCategory}
          eventDate={eventDate}
          location={event.location}
          currentParticipants={currentParticipants}
          maxParticipants={event.max_participants}
          mapLink={event.map_link}
        />
        
        <EventCardActions 
          isCreator={isCreator}
          isParticipating={effectiveIsParticipating}
          isPastEvent={isPastEvent}
          isProcessing={isProcessing}
          isDisabled={isDisabled}
          displayedParticipants={currentParticipants}
          maxParticipants={event.max_participants}
          onJoin={handleJoinClick}
          onDelete={() => onDelete(event.id)}
          eventId={event.id}
        />
      </div>
    </Card>
  );
}
