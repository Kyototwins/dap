
import { Profile } from "@/types/messages";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Book } from "lucide-react";

interface AboutMeProps {
  profile: Profile;
}

export function AboutMe({ profile }: AboutMeProps) {
  if (!profile.about_me) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Book className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-semibold">自己紹介</h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-line">{profile.about_me}</p>
      </CardContent>
    </Card>
  );
}
