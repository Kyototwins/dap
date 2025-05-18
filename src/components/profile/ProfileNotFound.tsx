
import { SearchX } from "lucide-react";

interface ProfileNotFoundProps {
  message: string;
}

export function ProfileNotFound({ message }: ProfileNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <SearchX className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">プロフィールが見つかりません</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
    </div>
  );
}
