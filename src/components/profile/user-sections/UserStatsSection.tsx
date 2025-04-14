
import { Card, CardContent } from "@/components/ui/card";
import { UserStats } from "@/services/profileStatsService";

interface UserStatsSectionProps {
  stats: UserStats;
  loading: boolean;
}

export function UserStatsSection({ stats, loading }: UserStatsSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">CONNECTIONS</p>
            <p className="text-2xl font-semibold text-doshisha-purple">
              {loading ? "..." : stats.connectionsCount}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">EVENTS</p>
            <p className="text-2xl font-semibold text-doshisha-purple">
              {loading ? "..." : stats.eventsCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
