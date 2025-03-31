
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
    <Card className="relative border-l-4 border-doshisha-purple bg-doshisha-softPurple/30">
      <CardHeader className="flex flex-row items-center gap-2">
        <Book className="w-5 h-5 text-doshisha-purple" />
        <h2 className="text-lg font-semibold text-doshisha-darkPurple">自己紹介</h2>
      </CardHeader>
      <CardContent>
        <div className="relative pl-4">
          <div className="absolute left-0 top-0 h-full w-1 bg-doshisha-purple opacity-30"></div>
          <p className="text-muted-foreground whitespace-pre-line italic relative pl-2">
            <span className="absolute -left-4 text-doshisha-purple text-4xl opacity-50">&quot;</span>
            {profile.about_me}
            <span className="absolute -right-4 text-doshisha-purple text-4xl opacity-50">&quot;</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
