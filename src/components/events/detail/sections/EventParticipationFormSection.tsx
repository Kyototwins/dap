import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";
interface EventParticipationFormSectionProps {
  event: Event;
}
export function EventParticipationFormSection({
  event
}: EventParticipationFormSectionProps) {
  if (!event.participation_form) return null;
  const handleFormClick = () => {
    window.open(event.participation_form, '_blank', 'noopener,noreferrer');
  };
  return <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">
            Participation Form Required
          </h3>
          <p className="text-sm text-blue-700 mb-3">Please fill out the participation form to join this event. Don't forget to also press the JOIN button!</p>
          <Button onClick={handleFormClick} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Fill Out Form
          </Button>
        </div>
      </div>
    </div>;
}