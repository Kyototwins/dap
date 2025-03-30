
import { Profile } from "@/types/messages";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { School } from "lucide-react";

interface EducationInfoProps {
  profile: Profile;
}

export function EducationInfo({ profile }: EducationInfoProps) {
  if (!profile.university && !profile.department && !profile.year) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <School className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-semibold">学歴情報</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.university && (
            <div>
              <h3 className="font-medium mb-2">大学</h3>
              <p className="text-muted-foreground">{profile.university}</p>
            </div>
          )}
          {profile.department && (
            <div>
              <h3 className="font-medium mb-2">学部</h3>
              <p className="text-muted-foreground">{profile.department}</p>
            </div>
          )}
          {profile.year && (
            <div>
              <h3 className="font-medium mb-2">学年</h3>
              <p className="text-muted-foreground">{profile.year}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
