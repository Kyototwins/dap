import { Event } from "@/types/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, MapPin, Check, Edit, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EventDetailsInfoProps {
  event: Event;
  isCreator: boolean;
  isParticipating?: boolean;
  isProcessing?: boolean;
  onParticipate?: (eventId: string, eventTitle: string) => void;
  refreshEvents?: () => void;
}

const categoryTranslationMap: Record<string, string> = {
  'スポーツ': 'Sports',
  '勉強': 'Study',
  '食事': 'Meal',
  'カラオケ': 'Karaoke',
  '観光': 'Sightseeing',
  'その他': 'Other',
  // fallback if category is already English or others
  'Sports': 'Sports',
  'Study': 'Study',
  'Meal': 'Meal',
  'Karaoke': 'Karaoke',
  'Sightseeing': 'Sightseeing',
  'Other': 'Other',
};

export function EventDetailsInfo({ 
  event, 
  isCreator, 
  isParticipating = false,
  isProcessing = false,
  onParticipate,
  refreshEvents
}: EventDetailsInfoProps) {
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editedLocation, setEditedLocation] = useState(event.location);
  const [editedDate, setEditedDate] = useState(event.date);
  const { toast } = useToast();

  useEffect(() => {
    setEditedLocation(event.location);
    setEditedDate(event.date);
  }, [event.location, event.date]);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const saveLocation = async () => {
    if (!event) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .update({ location: editedLocation })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "Location updated",
        description: "Event location has been updated successfully."
      });
      
      setIsEditingLocation(false);
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "Error updating location",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const saveDate = async () => {
    if (!event) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .update({ date: editedDate })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "Date updated",
        description: "Event date has been updated successfully."
      });
      
      setIsEditingDate(false);
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "Error updating date",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const cancelLocationEdit = () => {
    setEditedLocation(event.location);
    setIsEditingLocation(false);
  };

  const cancelDateEdit = () => {
    setEditedDate(event.date);
    setIsEditingDate(false);
  };

  const displayCategory = categoryTranslationMap[event.category] || event.category;
  
  // Determine button text and styling based on participation status
  const buttonText = isParticipating ? "Joined" : "Join Event";
  const buttonVariant = isParticipating ? "outline" : "default";
  const buttonClass = isParticipating 
    ? "bg-[#e5deff] text-[#7f1184] hover:bg-[#d8cefd] hover:text-[#7f1184]" 
    : "";
  const buttonIcon = isParticipating ? <Check className="w-4 h-4 mr-1" /> : null;

  return (
    <div className="space-y-2">
      {/* Date editing section */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {isEditingDate ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="datetime-local"
              value={formatDateForInput(editedDate)}
              onChange={(e) => setEditedDate(new Date(e.target.value).toISOString())}
              className="text-sm"
            />
            <Button
              onClick={saveDate}
              size="sm"
              variant="ghost"
              className="p-1 h-auto"
            >
              <Save className="h-3 w-3" />
            </Button>
            <Button
              onClick={cancelDateEdit}
              size="sm"
              variant="ghost"
              className="p-1 h-auto"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <span>{formatEventDate(event.date)}</span>
            {isCreator && (
              <Button
                onClick={() => setIsEditingDate(true)}
                size="sm"
                variant="ghost"
                className="p-1 h-auto ml-1"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            <span>•</span>
            <span>{event.location}</span>
          </>
        )}
      </div>
      
      {/* Location and Map Link */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4" />
        {isEditingLocation ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
              className="text-sm"
              placeholder="Event location"
            />
            <Button
              onClick={saveLocation}
              size="sm"
              variant="ghost"
              className="p-1 h-auto"
            >
              <Save className="h-3 w-3" />
            </Button>
            <Button
              onClick={cancelLocationEdit}
              size="sm"
              variant="ghost"
              className="p-1 h-auto"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <span>{event.location}</span>
            {isCreator && (
              <Button
                onClick={() => setIsEditingLocation(true)}
                size="sm"
                variant="ghost"
                className="p-1 h-auto ml-1"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </>
        )}
        {event.map_link && !isEditingLocation && (
          <a 
            href={event.map_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:text-blue-600 hover:underline ml-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Link2 className="h-4 w-4 mr-1" />
            <span>Map</span>
          </a>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-gray-100">
          {displayCategory}
        </Badge>
        
        {/* Join button for non-creators only - removed edit button */}
        {!isCreator && onParticipate && (
          <Button
            onClick={() => onParticipate(event.id, event.title)}
            disabled={isProcessing || isParticipating}
            variant={buttonVariant}
            className={buttonClass}
            size="sm"
          >
            {isProcessing ? "Processing..." : buttonText}
            {buttonIcon}
          </Button>
        )}
      </div>
      <div className="text-sm text-gray-600">
        Participants: {event.max_participants === 0 
          ? `${event.current_participants}/∞` 
          : `${event.current_participants}/${event.max_participants}`}
      </div>
    </div>
  );
}
