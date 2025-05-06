
interface EventCardImageProps {
  imageUrl: string | null;
  title: string;
  isPastEvent: boolean;
}

export function EventCardImage({ imageUrl, title, isPastEvent }: EventCardImageProps) {
  return (
    <div className="relative h-48 w-full">
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={title}
        className="h-full w-full object-cover"
      />
      {isPastEvent && (
        <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-xs font-bold px-3 py-1 rotate-0 m-2 rounded">
          Past Event
        </div>
      )}
    </div>
  );
}
