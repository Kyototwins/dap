
import { Edit2, Book } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/messages";

interface ProfileBioProps {
  profile: Profile;
  onEditClick: () => void;
}

export function ProfileBio({ profile, onEditClick }: ProfileBioProps) {
  return (
    <Card className="relative border-l-4 border-doshisha-purple bg-doshisha-softPurple/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-doshisha-purple" />
          <h2 className="text-lg font-semibold text-doshisha-darkPurple">自己紹介</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onEditClick}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative pl-4">
          <div className="absolute left-0 top-0 h-full w-1 bg-doshisha-purple opacity-30"></div>
          <p className="text-muted-foreground whitespace-pre-line italic before:content-['"'] before:absolute before:-left-4 before:text-doshisha-purple before:text-4xl before:opacity-50 after:content-['"'] after:absolute after:-right-4 after:text-doshisha-purple after:text-4xl after:opacity-50 pl-2 relative">
            {profile.about_me || "自己紹介文が未設定です"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
