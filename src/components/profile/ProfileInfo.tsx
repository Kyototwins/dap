import { Profile } from "@/types/messages";

interface ProfileInfoProps {
  profile: Profile;
  completion?: number;
  onEditProfile?: () => void;
}

export function ProfileInfo({ profile, completion = 0, onEditProfile }: ProfileInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">プロフィール完成度: {completion}%</h3>
      {/* Profile statistics and data visualization would go here */}
      <div className="bg-muted p-4 rounded-md">
        <p className="text-sm text-muted-foreground">
          プロフィール情報を更新することで、より多くのユーザーとマッチする可能性が高まります。
        </p>
      </div>
    </div>
  );
}
