
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Star, Sparkles } from "lucide-react";

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
      
      <div className="relative border-2 border-dashed border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
        {/* Cute recommended badge */}
        <div className="absolute -top-3 left-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3" />
          RECOMMENDED
          <Star className="w-3 h-3" />
        </div>
        
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">
                💌 Use custom email for notifications
              </p>
              <p className="text-xs text-gray-600">
                Use a different email address that you check regularly!
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isCustomEmail}
                onCheckedChange={onCustomToggle}
                disabled={loading || isEditing}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-400 data-[state=checked]:to-purple-400"
              />
              <Label className="font-medium">
                {isCustomEmail ? "✨ Custom" : "Default"}
              </Label>
            </div>
          </div>
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
              className={isCustomEmail ? "border-pink-300 focus:border-pink-400" : ""}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="default"
              size="sm" 
              onClick={onSaveEmail}
              disabled={loading || !email}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
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
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              Edit
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {isCustomEmail ? "🎉 Using custom email address" : "Using account email address"}
          </p>
        </div>
      )}
    </div>
  );
}
