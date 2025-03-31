
interface ProfileCoverProps {
  imageUrl: string | null;
}

export function ProfileCover({ imageUrl }: ProfileCoverProps) {
  return (
    <div className="relative h-48 -mx-4 bg-gray-200 overflow-hidden">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Cover" 
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("Cover image load error:", e);
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-50" />
      )}
    </div>
  );
}
