
import { Card } from "@/components/ui/card";
import { Event } from "@/types/events";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { EventCardImage } from "./eventCard/EventCardImage";
import { EventCardHeader } from "./eventCard/EventCardHeader";
import { EventCardDetails } from "./eventCard/EventCardDetails";
import { EventCardActions } from "./eventCard/EventCardActions";
import { categoryTranslationMap } from "./eventCard/categoryTranslation";

interface EventCardProps {
  event: Event;
  isParticipating: boolean;
  onJoin: (eventId: string, eventTitle: string) => void;
  onCardClick: (event: Event) => void;
  isProcessing?: boolean;
  onDelete?: (eventId: string) => void;
}

export function EventCard({ event, isParticipating, onJoin, onCardClick, isProcessing = false, onDelete }: EventCardProps) {
  const [isCreator, setIsCreator] = useState(false);
  const [effectiveIsParticipating, setEffectiveIsParticipating] = useState(isParticipating);
  const [displayedParticipants, setDisplayedParticipants] = useState(event.current_participants);
  const navigate = useNavigate();
  
  // Update displayed participants when the event data changes
  useEffect(() => {
    // Get stored count from localStorage (if any)
    const storedCount = localStorage.getItem(`event_${event.id}_count`);
    // Use whichever is higher - server count or stored count
    if (storedCount) {
      const parsedCount = parseInt(storedCount, 10);
      if (parsedCount > event.current_participants) {
        setDisplayedParticipants(parsedCount);
      } else {
        setDisplayedParticipants(event.current_participants);
        // Update localStorage with new count if it's higher
        localStorage.setItem(`event_${event.id}_count`, String(event.current_participants));
      }
    } else {
      setDisplayedParticipants(event.current_participants);
      // Initialize localStorage with current count
      localStorage.setItem(`event_${event.id}_count`, String(event.current_participants));
    }
  }, [event.id, event.current_participants]);
  
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

  // Update when isParticipating prop changes
  useEffect(() => {
    if (!isCreator) {
      setEffectiveIsParticipating(isParticipating);
    }
  }, [isParticipating, isCreator]);

  const displayCategory = categoryTranslationMap[event.category] || event.category;
  const eventDate = new Date(event.date);
  const currentDate = new Date();
  const isPastEvent = eventDate < currentDate;
  
  // Determine if the button should be disabled
  const isDisabled = isProcessing || 
    isPastEvent || 
    (!effectiveIsParticipating && event.max_participants !== 0 && displayedParticipants >= event.max_participants) ||
    effectiveIsParticipating;  // Disable if already participating
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/events/edit/${event.id}`);
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled && !effectiveIsParticipating) {
      onJoin(event.id, event.title);
      
      // Optimistically update the displayed participant count and save to localStorage
      const newCount = displayedParticipants + 1;
      setDisplayedParticipants(newCount);
      localStorage.setItem(`event_${event.id}_count`, String(newCount));
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(event.id);
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
          currentParticipants={displayedParticipants}
          maxParticipants={event.max_participants}
          mapLink={event.map_link}
        />
        
        <EventCardActions 
          isCreator={isCreator}
          isParticipating={effectiveIsParticipating}
          isPastEvent={isPastEvent}
          isProcessing={isProcessing}
          isDisabled={isDisabled}
          displayedParticipants={displayedParticipants}
          maxParticipants={event.max_participants}
          onJoin={handleJoinClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          eventId={event.id}
        />
      </div>
    </Card>
  );
}
