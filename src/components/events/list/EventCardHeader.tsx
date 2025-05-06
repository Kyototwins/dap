
interface EventCardHeaderProps {
  title: string;
  creatorFirstName: string | null;
  creatorLastName: string | null;
  creatorAvatarUrl: string | null;
}

export function EventCardHeader({
  title,
  creatorFirstName,
  creatorLastName,
  creatorAvatarUrl
}: EventCardHeaderProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
      
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full overflow-hidden">
          <img
            src={creatorAvatarUrl || "/placeholder.svg"}
            alt={`${creatorFirstName || 'User'}'s avatar`}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-sm text-gray-700">
          {creatorFirstName} {creatorLastName}
        </span>
      </div>
    </div>
  );
}
