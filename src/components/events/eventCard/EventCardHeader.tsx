
import React from "react";
import { Avatar } from "@/components/ui/avatar";

interface EventCardHeaderProps {
  title: string;
  creatorFirstName?: string;
  creatorLastName?: string;
  creatorAvatarUrl?: string;
}

export function EventCardHeader({ 
  title, 
  creatorFirstName, 
  creatorLastName, 
  creatorAvatarUrl 
}: EventCardHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <Avatar className="h-10 w-10">
        <img
          src={creatorAvatarUrl || "/placeholder.svg"}
          alt={`${creatorFirstName}'s avatar`}
        />
      </Avatar>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">
          Organizer: {creatorFirstName} {creatorLastName}
        </p>
      </div>
    </div>
  );
}
