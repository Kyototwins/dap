
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";

interface CreateEventButtonProps {
  hasCreatedEvent: boolean;
  navigate: NavigateFunction;
}

export function CreateEventButton({ hasCreatedEvent, navigate }: CreateEventButtonProps) {
  return (
    <div className="fixed bottom-16 right-6 z-10 flex flex-col items-end gap-2">
      {!hasCreatedEvent && (
        <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-md relative">
          <p className="text-[0.7rem] font-medium text-[#7f1184] leading-tight">
            Add your<br />
            own event
          </p>
          {/* Triangle for speech bubble effect */}
          <div className="absolute bottom-[-8px] right-5 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
        </div>
      )}
      <Button 
        onClick={() => navigate("/events/new")} 
        className="bg-[#7f1184] hover:bg-[#671073] text-white rounded-full shadow-lg" 
        size="icon"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
}
