
interface EventParticipantsCountProps {
  currentParticipants: number;
  maxParticipants: number;
}

export function EventParticipantsCount({ currentParticipants, maxParticipants }: EventParticipantsCountProps) {
  return (
    <div className="text-sm text-gray-600">
      Participants: {maxParticipants === 0 
        ? `${currentParticipants}/∞` 
        : `${currentParticipants}/${maxParticipants}`}
    </div>
  );
}
