
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface NotificationEmailSectionProps {
  email: string;
  isCustomEmail: boolean;
  isEditing: boolean;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onCustomToggle: () => void;
  onSaveEmail: () => Promise<void>;
  onEditToggle: (editing: boolean) => void;
}

export function NotificationEmailSection({
  email,
  isCustomEmail,
  isEditing,
  loading,
  onEmailChange,
  onCustomToggle,
  onSaveEmail,
  onEditToggle
}: NotificationEmailSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Mail className="w-5 h-5" />
        <h3 className="font-medium">Notification Email</h3>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Use custom email for notifications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isCustomEmail}
            onCheckedChange={onCustomToggle}
            disabled={loading || isEditing}
          />
          <Label>{isCustomEmail ? "Custom" : "Default"}</Label>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification-email">Email Address</Label>
            <Input
              id="notification-email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Enter email address"
              type="email"
              disabled={loading || !isCustomEmail}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="default"
              size="sm" 
              onClick={onSaveEmail}
              disabled={loading || !email}
            >
              Save
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEditToggle(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded-md flex justify-between items-center">
            <span className="text-sm font-medium break-all">
              {email}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEditToggle(true)}
              disabled={loading}
            >
              Edit
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {isCustomEmail ? "Using custom email address" : "Using account email address"}
          </p>
        </div>
      )}
    </div>
  );
}
