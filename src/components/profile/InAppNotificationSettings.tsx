
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export function InAppNotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          In-App Notifications
        </CardTitle>
        <CardDescription>
          Manage your in-app notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
          Currently, all in-app notifications are enabled by default. These settings will be customizable in the future.
        </div>
      </CardContent>
    </Card>
  );
}
