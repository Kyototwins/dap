
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { Check, Edit, Trash2, X } from "lucide-react";

interface EventDetailsDescriptionProps {
  event: Event;
  isCreator: boolean;
  refreshEvents?: () => void;
  editedDescription: string;
  setEditedDescription: (value: string) => void;
  onDeleteClick: () => void;
}

export function EventDetailsDescription({
  event,
  isCreator,
  refreshEvents,
  editedDescription,
  setEditedDescription,
  onDeleteClick
}: EventDetailsDescriptionProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const { toast } = useToast();

  // Save description function
  const saveDescription = async () => {
    if (!event) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .update({ description: editedDescription })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "説明が更新されました",
        description: "イベントの説明が更新されました。"
      });
      
      setIsEditingDescription(false);
      // Refresh events if provided
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "説明の更新に失敗しました",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="px-4 pb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="font-semibold text-gray-700">説明</div>
        {isCreator && (
          <div className="flex gap-2">
            {!isEditingDescription && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsEditingDescription(true)}
              >
                <Edit className="w-4 h-4 mr-1" />
                編集
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-red-500 hover:text-red-700"
              onClick={onDeleteClick}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              削除
            </Button>
          </div>
        )}
      </div>
      
      {isEditingDescription ? (
        <div className="space-y-2">
          <Textarea 
            value={editedDescription} 
            onChange={(e) => setEditedDescription(e.target.value)}
            className="min-h-[120px] text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setEditedDescription(event.description);
                setIsEditingDescription(false);
              }}
            >
              <X className="w-4 h-4 mr-1" />
              キャンセル
            </Button>
            <Button 
              size="sm"
              onClick={saveDescription}
            >
              <Check className="w-4 h-4 mr-1" />
              保存
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="text-gray-700 text-sm bg-gray-100 rounded p-3"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {event.description}
        </div>
      )}
    </div>
  );
}
