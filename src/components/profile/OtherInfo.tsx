
import { Edit2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/messages";

interface OtherInfoProps {
  profile: Profile;
  onEditClick: () => void;
}

export function OtherInfo({ profile, onEditClick }: OtherInfoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">その他の情報</h2>
        <Button variant="ghost" size="icon" onClick={onEditClick}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">人生の目標</h3>
          <p className="text-muted-foreground">{profile.life_goal || "未設定"}</p>
        </div>
        <div>
          <h3 className="font-medium mb-2">欲しい超能力</h3>
          <p className="text-muted-foreground">{profile.superpower || "未設定"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
