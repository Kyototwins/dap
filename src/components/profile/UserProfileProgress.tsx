
interface UserProfileProgressProps {
  progress: number;
}

export function UserProfileProgress({ progress }: UserProfileProgressProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">プロフィール完成度: {progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-doshisha-purple" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
