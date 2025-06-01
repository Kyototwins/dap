
interface EventParticipantsCountProps {
  currentParticipants: number;
  maxParticipants: number;
}

export function EventParticipantsCount({ currentParticipants, maxParticipants }: EventParticipantsCountProps) {
  // Add 1 to include the event creator in the count
  const totalParticipants = currentParticipants + 1;
  
  return (
    <div className="text-sm text-gray-600">
      Participants: {maxParticipants === 0 
        ? `${totalParticipants}/∞` 
        : `${totalParticipants}/${maxParticipants}`}
    </div>
  );
}
