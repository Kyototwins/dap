
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell } from "lucide-react";

interface EmailDigestToggleProps {
  enabled: boolean;
  loading: boolean;
  notificationTime: string;
  onToggle: () => Promise<void>;
  onTimeChange: (time: string) => Promise<void>;
}

export function EmailDigestToggle({ 
  enabled, 
  loading, 
  notificationTime, 
  onToggle, 
  onTimeChange 
}: EmailDigestToggleProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">Daily Digest Email</h3>
          <p className="text-sm text-muted-foreground">
            Receive a daily summary of your activity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            disabled={loading}
          />
          <Label htmlFor="daily-digest">{enabled ? "On" : "Off"}</Label>
        </div>
      </div>
      
      {enabled && (
        <div className="flex items-center justify-between pl-4">
          <Label htmlFor="notification-time" className="text-sm">Time to receive notifications:</Label>
          <Select
            value={notificationTime}
            onValueChange={onTimeChange}
            disabled={loading || !enabled}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem key={i} value={`${i}:00`}>
                  {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {!enabled && (
        <p className="text-sm text-amber-500">
          <strong>We recommend enabling notifications</strong> to stay updated on new messages and matches.
        </p>
      )}
    </div>
  );
}
