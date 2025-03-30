
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold">自己紹介</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onEditClick}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground whitespace-pre-line">
          {profile.about_me || "自己紹介文が未設定です"}
        </p>
      </CardContent>
    </Card>
  );
}
