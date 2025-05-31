
import { useState } from "react";
import { Event } from "@/types/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, MapPin, Check, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
  const [isEditingDateTime, setIsEditingDateTime] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editedDateTime, setEditedDateTime] = useState(format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"));
  const [editedLocation, setEditedLocation] = useState(event.location);
  const { toast } = useToast();

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const saveDateTime = async () => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ date: editedDateTime })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "日時が更新されました",
        description: "イベントの日時が正常に更新されました。",
      });
      
      setIsEditingDateTime(false);
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveLocation = async () => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ location: editedLocation })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "場所が更新されました",
        description: "イベントの場所が正常に更新されました。",
      });
      
      setIsEditingLocation(false);
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const displayCategory = categoryTranslationMap[event.category] || event.category;
  
  // Determine button text and styling based on participation status
  const buttonText = isParticipating ? "Joined" : "Join Event";
  const buttonVariant = isParticipating ? "outline" : "default";
  const buttonClass = isParticipating 
    ? "bg-[#e5deff] text-[#7f1184] hover:bg-[#d8cefd] hover:text-[#7f1184]" 
    : "";
  const buttonIcon = isParticipating ? <Check className="w-4 h-4 mr-1" /> : null;

  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd'T'HH:mm");

  return (
    <div className="space-y-2">
      {/* Date and Time */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {isEditingDateTime && isCreator ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="datetime-local"
              min={formattedToday}
              value={editedDateTime}
              onChange={(e) => setEditedDateTime(e.target.value)}
              className="text-sm h-8"
            />
            <Button onClick={saveDateTime} size="sm" className="h-8 w-8 p-0">
              <Save className="h-4 w-4" />
            </Button>
            <Button onClick={() => {
              setIsEditingDateTime(false);
              setEditedDateTime(format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"));
            }} size="sm" variant="outline" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{formatEventDate(event.date)}</span>
            {isCreator && (
              <Button 
                onClick={() => setIsEditingDateTime(true)} 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Location and Map Link */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4" />
        {isEditingLocation && isCreator ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
              className="text-sm h-8"
              placeholder="場所を入力"
            />
            <Button onClick={saveLocation} size="sm" className="h-8 w-8 p-0">
              <Save className="h-4 w-4" />
            </Button>
            <Button onClick={() => {
              setIsEditingLocation(false);
              setEditedLocation(event.location);
            }} size="sm" variant="outline" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{event.location}</span>
            {isCreator && (
              <Button 
                onClick={() => setIsEditingLocation(true)} 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
            {event.map_link && (
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
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-gray-100">
          {displayCategory}
        </Badge>
        
        {/* Join button for non-creators */}
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
