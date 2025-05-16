
import { ProfileFormContainer } from "./form/ProfileFormContainer";

interface ProfileFormProps {
  profile: any;
  onCancel: () => void;
}

export function ProfileForm({ profile, onCancel }: ProfileFormProps) {
  return <ProfileFormContainer profile={profile} onCancel={onCancel} />;
}
