
import { Bell, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EventsHeaderProps {
  unreadNotifications?: number;
  onSearchChange: (searchQuery: string) => void;
}

export function EventsHeader({ unreadNotifications = 0, onSearchChange }: EventsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">イベント</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </Button>
          <Button size="sm" onClick={() => navigate("/events/new")}>
            <Plus className="w-4 h-4 mr-2" />
            イベントを作成
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input 
          type="text"
          placeholder="キーワードで検索..."
          className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
