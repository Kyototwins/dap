
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

interface TestEmailSectionProps {
  enabled: boolean;
  sending: boolean;
  onSendTest: () => Promise<void>;
}

export function TestEmailSection({ enabled, sending, onSendTest }: TestEmailSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">Verify Notification Email</h3>
          <p className="text-sm text-muted-foreground">
            Send a test email to verify your notification settings
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSendTest}
          disabled={sending || !enabled}
          className="flex items-center gap-1"
        >
          <SendIcon className="w-4 h-4" />
          {sending ? "Sending..." : "Send Test"}
        </Button>
      </div>
      {!enabled && (
        <p className="text-xs text-amber-500 mt-2">
          Enable daily digest notifications first to send a test email
        </p>
      )}
    </div>
  );
}
