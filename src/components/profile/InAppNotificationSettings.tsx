
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export function InAppNotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          アプリ内通知
        </CardTitle>
        <CardDescription>
          アプリ内の通知設定を管理します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
          現在、すべてのアプリ内通知はデフォルトで有効になっています。これらの設定は後日カスタマイズできるようになります。
        </div>
      </CardContent>
    </Card>
  );
}
