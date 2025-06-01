
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Link2 } from "lucide-react";
import { format } from "date-fns";

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
  // Format date and time
  const formattedDate = format(eventDate, 'yyyy/MM/dd');
  const startTime = format(eventDate, 'h:mm a');
  
  // Add 1 to include the event creator in the count
  const totalParticipants = currentParticipants + 1;
  
  // For unlimited participants, show the infinity symbol with total participants
  const participantsDisplay = maxParticipants === 0 
    ? `${totalParticipants}/∞` 
    : `${totalParticipants}/${maxParticipants}`;

  // Generate a Google Maps link
  const getMapLink = (location: string) => {
    // If a custom map link is provided, use that instead
    if (mapLink) {
      return mapLink;
    }
    
    // Otherwise generate a Google Maps link from the location
    const encodedLocation = encodeURIComponent(location);
    return `https://maps.google.com/maps?q=${encodedLocation}`;
  };

  return (
    <>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {description}
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="language">{displayCategory}</Badge>
          <span className="text-gray-600">
            {formattedDate} {startTime}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center text-gray-600">
            <MapPin className="h-3 w-3 mr-1" /> 
            <a 
              href={getMapLink(location)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-600"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-medium mr-1">Place:</span>
              {location}
            </a>
            {mapLink && (
              <Link2 className="ml-1 h-3 w-3 text-blue-500" />
            )}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">
            Participants: {participantsDisplay}
          </span>
        </div>
      </div>
    </>
  );
}
