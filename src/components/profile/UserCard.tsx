
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types/messages";
import { useUserMatchStatus } from "./hooks/useUserMatchStatus";
import { UserCardButtons } from "./UserCardButtons";
import { getLanguageLevelLabel } from "@/utils/languageUtils";

interface UserCardProps {
  profile: Profile;
}

export function UserCard({ profile }: UserCardProps) {
  const navigate = useNavigate();
  const { isLoading, isMatched, handleMatch } = useUserMatchStatus({
    id: profile.id,
    onMatched: () => navigate(`/messages?user=${profile.id}`),
  });

  const handleViewProfile = () => {
    navigate(`/profile/${profile.id}`);
  };

  const handleMessage = () => {
    navigate(`/messages?user=${profile.id}`);
  };

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <ProfileAvatar profile={profile} initials={initials} />
        <div className="p-4 flex-1">
          <ProfileHeader profile={profile} />
          <ProfileDescription profile={profile} />
          <ProfileLanguages profile={profile} />
          <ProfileLearningLanguages profile={profile} />
          <ProfileHobbies profile={profile} />
          <UserCardButtons
            isMatched={isMatched}
            isLoading={isLoading}
            onMatch={() => handleMatch({ id: profile.id })}
            onView={handleViewProfile}
            onMessage={handleMessage}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileAvatar({ profile, initials }: { profile: Profile, initials: string }) {
  return (
    <div className="aspect-square w-full md:w-1/3 relative overflow-hidden">
      <Avatar className="w-full h-full rounded-none">
        <AvatarImage
          src={profile.avatar_url || "/placeholder.svg"}
          alt={`${profile.first_name || ''}のプロフィール`}
          className="w-full h-full object-cover"
        />
        <AvatarFallback className="w-full h-full text-2xl rounded-none">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold mb-1 text-doshisha-darkPurple">
          {profile.first_name} {profile.last_name}
          {profile.age && <span className="text-base font-normal text-muted-foreground ml-2">{profile.age}歳</span>}
        </h3>
        {profile.university && (
          <p className="text-muted-foreground text-sm mb-1">
            {profile.university}
          </p>
        )}
        {profile.department && profile.year && (
          <p className="text-muted-foreground text-xs mb-3">
            {profile.department} • {profile.year}
          </p>
        )}
      </div>
    </div>
  );
}

function ProfileDescription({ profile }: { profile: Profile }) {
  if (!profile.about_me) return null;
  
  return (
    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 break-words whitespace-pre-wrap">
      {profile.about_me}
    </p>
  );
}

function ProfileLanguages({ profile }: { profile: Profile }) {
  if (!profile.languages || profile.languages.length === 0 || !profile.language_levels) return null;
  
  return (
    <div className="mb-3">
      <h4 className="text-xs font-medium text-muted-foreground mb-1">Language Skills</h4>
      <div className="flex flex-wrap gap-1 mb-2">
        {profile.languages.slice(0, 3).map((lang) => (
          <Badge key={lang} variant="language">
            {lang}
            {typeof profile.language_levels === 'object' && profile.language_levels[lang] && (
              <span className="ml-1 text-xs opacity-75">
                ({getLanguageLevelLabel(profile.language_levels[lang])})
              </span>
            )}
          </Badge>
        ))}
        {profile.languages.length > 3 && (
          <Badge variant="secondary">+{profile.languages.length - 3}</Badge>
        )}
      </div>
    </div>
  );
}

function ProfileLearningLanguages({ profile }: { profile: Profile }) {
  if (!profile.learning_languages || profile.learning_languages.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {profile.learning_languages.map((lang) => (
        <Badge key={lang} variant="language">
          {lang}学習中
        </Badge>
      ))}
    </div>
  );
}

function ProfileHobbies({ profile }: { profile: Profile }) {
  if (!profile.hobbies || profile.hobbies.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {profile.hobbies.slice(0, 3).map((hobby) => (
        <Badge key={hobby} variant="secondary">
          {hobby}
        </Badge>
      ))}
      {profile.hobbies.length > 3 && (
        <Badge variant="secondary">+{profile.hobbies.length - 3}</Badge>
      )}
    </div>
  );
}
