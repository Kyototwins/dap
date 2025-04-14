
import { Profile } from "@/types/messages";
import { Card, CardContent } from "@/components/ui/card";

interface UserAboutSectionProps {
  profile: Profile;
}

export function UserAboutSection({ profile }: UserAboutSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">About</h3>
        <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
          {profile.about_me || "No introduction provided yet."}
        </p>
      </CardContent>
    </Card>
  );
}
