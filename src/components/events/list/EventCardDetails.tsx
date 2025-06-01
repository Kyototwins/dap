
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Link2 } from "lucide-react";

interface EventCardDetailsProps {
  description: string;
  category: string;
  displayCategory: string;
  eventDate: Date;
  location: string;
  currentParticipants: number;
  maxParticipants: number;
  mapLink?: string | null;
}

export function EventCardDetails({
  description,
  category,
  displayCategory,
  eventDate,
  location,
  currentParticipants,
  maxParticipants,
  mapLink
}: EventCardDetailsProps) {
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Add 1 to include the event creator in the count
  const totalParticipants = currentParticipants + 1;

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
          {mapLink && (
            <a 
              href={mapLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 hover:text-blue-600 hover:underline ml-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Link2 className="h-3 w-3 mr-0.5" />
              <span>Map</span>
            </a>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Users className="h-3.5 w-3.5" />
          <span>
            {maxParticipants === 0 
              ? `${totalParticipants} participating` 
              : `${totalParticipants}/${maxParticipants} participating`}
          </span>
        </div>
      </div>
    </div>
  );
}
