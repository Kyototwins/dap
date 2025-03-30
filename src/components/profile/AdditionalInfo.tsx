
import { Profile } from "@/types/messages";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface AdditionalInfoProps {
  profile: Profile;
}

export function AdditionalInfo({ profile }: AdditionalInfoProps) {
  if (!profile.ideal_date && !profile.life_goal && !profile.superpower) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">その他の情報</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.ideal_date && (
          <div>
            <h3 className="font-medium mb-2">理想のデート</h3>
            <p className="text-muted-foreground">{profile.ideal_date}</p>
          </div>
        )}
        {profile.life_goal && (
          <div>
            <h3 className="font-medium mb-2">人生の目標</h3>
            <p className="text-muted-foreground">{profile.life_goal}</p>
          </div>
        )}
        {profile.superpower && (
          <div>
            <h3 className="font-medium mb-2">欲しい超能力</h3>
            <p className="text-muted-foreground">{profile.superpower}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
