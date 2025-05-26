import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
interface EmailDigestToggleProps {
  enabled: boolean;
  loading: boolean;
  onToggle: () => Promise<void>;
}
export function EmailDigestToggle({
  enabled,
  loading,
  onToggle
}: EmailDigestToggleProps) {
  return <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium">Daily Digest Email</h3>
        </div>
        <p className="text-sm text-muted-foreground">Receive a daily summary of your activity at random timing (hopfully everyday but idk)</p>
      </div>
      <div className="flex items-center space-x-2">
        <Switch checked={enabled} onCheckedChange={onToggle} disabled={loading} />
        <Label htmlFor="daily-digest">
          {loading ? "Updating..." : enabled ? "On" : "Off"}
        </Label>
      </div>
    </div>;
}