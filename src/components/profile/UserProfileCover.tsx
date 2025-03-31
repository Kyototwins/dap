
import { ProfileCover } from "./ProfileCover";

interface UserProfileCoverProps {
  imageUrl: string | null;
}

export function UserProfileCover({ imageUrl }: UserProfileCoverProps) {
  return <ProfileCover imageUrl={imageUrl} />;
}
