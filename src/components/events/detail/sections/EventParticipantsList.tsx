
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchEventParticipants, EventParticipant } from "@/services/eventParticipantsService";
import { Event } from "@/types/events";

interface EventParticipantsListProps {
  event: Event;
}

export function EventParticipantsList({ event }: EventParticipantsListProps) {
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadParticipants();
  }, [event.id]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const participantsData = await fetchEventParticipants(event.id);
      setParticipants(participantsData);
    } catch (error) {
      console.error("Failed to load participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="px-4 pb-4">
        <div className="font-semibold text-gray-700 mb-2">Participants</div>
        <div className="text-sm text-gray-500">Loading participants...</div>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="px-4 pb-4">
        <div className="font-semibold text-gray-700 mb-2">Participants</div>
        <div className="text-sm text-gray-500">No participants yet</div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <div className="font-semibold text-gray-700 mb-3">
        Participants ({participants.length + 1}) {/* +1 for event creator */}
      </div>
      <div className="space-y-2">
        {/* Show event creator first */}
        {event.creator && (
          <div
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleParticipantClick(event.creator_id)}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={event.creator.avatar_url || "/placeholder.svg"}
                alt={`${event.creator.first_name}'s avatar`}
              />
              <AvatarFallback>
                {event.creator.first_name?.[0]}{event.creator.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {event.creator.first_name} {event.creator.last_name}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Organizer
              </span>
            </div>
          </div>
        )}
        
        {/* Show other participants */}
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleParticipantClick(participant.user_id)}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={participant.user.avatar_url || "/placeholder.svg"}
                alt={`${participant.user.first_name}'s avatar`}
              />
              <AvatarFallback>
                {participant.user.first_name?.[0]}{participant.user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-900">
              {participant.user.first_name} {participant.user.last_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
