
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EventDateTimeSectionProps {
  event: Event;
  isCreator: boolean;
  refreshEvents?: () => void;
}

export function EventDateTimeSection({ event, isCreator, refreshEvents }: EventDateTimeSectionProps) {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editedDate, setEditedDate] = useState(event.date);
  const { toast } = useToast();

  useEffect(() => {
    setEditedDate(event.date);
  }, [event.date]);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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

  const cancelDateEdit = () => {
    setEditedDate(event.date);
    setIsEditingDate(false);
  };

  return (
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
        </>
      )}
    </div>
  );
}
