
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Check, X } from "lucide-react";

interface EventDetailsDescriptionProps {
  event: Event;
  isCreator: boolean;
  isEditingDescription: boolean;
  editedDescription: string;
  setIsEditingDescription: (editing: boolean) => void;
  setEditedDescription: (description: string) => void;
  saveDescription: () => void;
}

export function EventDetailsDescription({
  event,
  isCreator,
  isEditingDescription,
  editedDescription,
  setIsEditingDescription,
  setEditedDescription,
  saveDescription
}: EventDetailsDescriptionProps) {
  return (
    <div className="px-4 pb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="font-semibold text-gray-700">Description</div>
        {isCreator && !isEditingDescription && (
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsEditingDescription(true)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
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
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={saveDescription}
            >
              <Check className="w-4 h-4 mr-1" />
              Save
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
