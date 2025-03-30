
import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventsHeaderProps {
  unreadNotifications?: number;
  onSearchChange: (searchQuery: string) => void;
}

export function EventsHeader({ unreadNotifications = 0, onSearchChange }: EventsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">イベント</h1>
        <button className="relative p-2">
          <Bell className="h-5 w-5 text-gray-700" />
          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input 
          type="text"
          placeholder="イベントを検索..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-sm"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
