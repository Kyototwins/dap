
import React from "react";
import { Ribbon } from "lucide-react";

interface EventCardImageProps {
  imageUrl: string;
  title: string;
  isPastEvent: boolean;
}

export function EventCardImage({ imageUrl, title, isPastEvent }: EventCardImageProps) {
  return (
    <div className="relative aspect-video">
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={title}
        className="w-full h-full object-cover"
      />
      
      {isPastEvent && (
        <div className="absolute top-0 right-0 z-10 overflow-hidden w-20 h-20">
          <div className="absolute transform rotate-45 bg-[#444444] text-white text-xs font-bold py-1 text-center right-[-35px] top-[15px] w-[140px]">
            <span className="flex items-center justify-center gap-1">
              <Ribbon className="h-3 w-3" />
              Past Event
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
