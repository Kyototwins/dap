
import { Edit2, School } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/messages";

interface EducationDetailsProps {
  profile: Profile;
  onEditClick: () => void;
}

export function EducationDetails({ profile, onEditClick }: EducationDetailsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <School className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold">学歴情報</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onEditClick}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">大学</h3>
            <p className="text-muted-foreground">{profile.university || "未設定"}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">学部</h3>
            <p className="text-muted-foreground">{profile.department || "未設定"}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">学年</h3>
            <p className="text-muted-foreground">{profile.year || "未設定"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
