
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Link2, Edit, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EventLocationSectionProps {
  event: Event;
  isCreator: boolean;
  refreshEvents?: () => void;
}

export function EventLocationSection({ event, isCreator, refreshEvents }: EventLocationSectionProps) {
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editedLocation, setEditedLocation] = useState(event.location);
  const { toast } = useToast();

  useEffect(() => {
    setEditedLocation(event.location);
  }, [event.location]);

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

  const cancelLocationEdit = () => {
    setEditedLocation(event.location);
    setIsEditingLocation(false);
  };

  return (
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
  );
}
