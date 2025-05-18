
import { SearchX } from "lucide-react";

interface ProfileNotFoundProps {
  message: string;
  offline?: boolean;
  connectionError?: boolean;
}

export function ProfileNotFound({ message, offline, connectionError }: ProfileNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <SearchX className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">プロフィールが見つかりません</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
      
      {offline && (
        <p className="mt-4 text-amber-600">
          オフライン状態です。インターネット接続を確認してください。
        </p>
      )}
      
      {connectionError && !offline && (
        <p className="mt-4 text-red-600">
          サーバーに接続できません。しばらくしてからもう一度お試しください。
        </p>
      )}
    </div>
  );
}
