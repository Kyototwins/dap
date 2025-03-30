
import { Profile } from "@/types/messages";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

interface HobbiesDisplayProps {
  profile: Profile;
}

export function HobbiesDisplay({ profile }: HobbiesDisplayProps) {
  if (!profile.hobbies || profile.hobbies.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <GraduationCap className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-semibold">趣味・興味</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {profile.hobbies.map((hobby) => (
            <Badge key={hobby} variant="secondary">
              {hobby}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
