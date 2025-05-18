
import { Profile } from "@/types/profile";

interface ProfileInfoProps {
  profile: Profile;
  completion?: number;
  onEditProfile?: () => void;
}

export function ProfileInfo({ profile, completion, onEditProfile }: ProfileInfoProps) {
  // 既存のコンポーネントの実装を変更せずにプロパティだけを追加
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">プロフィール情報</h2>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">名前</span>
            <span>{profile.first_name} {profile.last_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">年齢</span>
            <span>{profile.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">性別</span>
            <span>{profile.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">出身</span>
            <span>{profile.origin}</span>
          </div>
        </div>
      </div>
      
      {onEditProfile && (
        <div className="flex justify-end">
          <button 
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={onEditProfile}
          >
            編集
          </button>
        </div>
      )}
    </div>
  );
}
