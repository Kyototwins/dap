
import { Profile } from "@/types/profile";

interface ProfileInfoProps {
  profile: Profile;
  completion?: number;
  onEditProfile?: () => void;
}

export function ProfileInfo({ profile, completion, onEditProfile }: ProfileInfoProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Profile Information</h2>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span>{profile.first_name} {profile.last_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age</span>
            <span>{profile.age} years old</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gender</span>
            <span>{profile.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Origin</span>
            <span>{profile.origin}</span>
          </div>
        </div>
      </div>
      
      {onEditProfile && (
        <div className="flex justify-end">
          <button 
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={onEditProfile}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
