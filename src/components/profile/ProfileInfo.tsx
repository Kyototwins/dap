
import { useState } from "react";

interface ProfileInfoProps {
  profile: any;
  completion?: number;
  onEditProfile?: () => void;
}

export function ProfileInfo({ profile, completion = 0, onEditProfile }: ProfileInfoProps) {
  const [activeSection, setActiveSection] = useState('stats');
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-3">プロフィール完成度</h3>
        <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
            style={{ width: `${completion}%` }}
          />
        </div>
        <div className="mt-1 text-right text-sm text-gray-600">{completion}%</div>
        
        <p className="mt-4 text-sm text-gray-600">
          プロフィールを充実させると、より多くのマッチが見つかりやすくなります。
        </p>
        
        {onEditProfile && (
          <button 
            onClick={onEditProfile} 
            className="w-full mt-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
          >
            プロフィールを編集する
          </button>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-3">アカウント情報</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-500">作成日</span>
            <span>
              {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '未設定'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-500">最終更新</span>
            <span>最近</span>
          </div>
        </div>
      </div>
    </div>
  );
}
