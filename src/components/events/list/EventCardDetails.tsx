
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardDetailsProps {
  description: string;
  category: string;
  displayCategory: string;
  eventDate: Date;
  location: string;
  currentParticipants: number;
  maxParticipants: number;
}

export function EventCardDetails({
  description,
  category,
  displayCategory,
  eventDate,
  location,
  currentParticipants,
  maxParticipants
}: EventCardDetailsProps) {
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-3 mt-2">
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      
      <div className="flex gap-1.5">
        <Badge variant="outline" className="bg-gray-100">
          {displayCategory}
        </Badge>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(eventDate)}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Users className="h-3.5 w-3.5" />
          <span>
            {maxParticipants === 0 
              ? `${currentParticipants}人参加` 
              : `${currentParticipants}/${maxParticipants}人参加`}
          </span>
        </div>
      </div>
    </div>
  );
}
