
import { Edit2, GraduationCap } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/types/messages";

interface HobbiesInterestsProps {
  profile: Profile;
  onEditClick: () => void;
}

export function HobbiesInterests({ profile, onEditClick }: HobbiesInterestsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold">趣味・興味</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onEditClick}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {profile.hobbies && profile.hobbies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby) => (
              <Badge key={hobby} variant="secondary">
                {hobby}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">趣味・興味が未設定です</p>
        )}
      </CardContent>
    </Card>
  );
}
