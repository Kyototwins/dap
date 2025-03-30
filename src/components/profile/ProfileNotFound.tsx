
import { Search } from "lucide-react";

interface ProfileNotFoundProps {
  message?: string;
}

export function ProfileNotFound({ message = "プロフィールが見つかりません" }: ProfileNotFoundProps) {
  return (
    <div className="p-8 text-center bg-white/70 backdrop-blur-sm rounded-lg border border-amber-100 shadow-sm">
      <div className="text-amber-400 mb-3">
        <Search className="h-12 w-12 mx-auto opacity-70" />
      </div>
      <p className="text-lg font-medium mb-1 text-amber-900">{message}</p>
      <p className="text-muted-foreground">検索条件を変更して再度お試しください</p>
    </div>
  );
}
