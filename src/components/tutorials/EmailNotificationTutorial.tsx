
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Star, Sparkles, Settings } from "lucide-react";

interface EmailNotificationTutorialProps {
  open: boolean;
  onRemindLater: () => void;
  onNeverShow: () => void;
}

export function EmailNotificationTutorial({ open, onRemindLater, onNeverShow }: EmailNotificationTutorialProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold text-pink-800 mb-2">
            ✨ Recommended! Get Notifications on Your Favorite Email! ✨
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <Mail className="w-12 h-12 mx-auto text-pink-600 mb-1" />
            <p className="text-gray-700 text-sm">Never miss important updates from DAP!</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <h3 className="font-bold text-pink-700 mb-2 flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4" />
              How to customize your notification email:
            </h3>
            
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Go to your <strong>Profile page</strong></li>
              <li>Scroll down to <strong>"Notification Settings"</strong></li>
              <li>Look for the <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white text-xs rounded-full"><Sparkles className="w-3 h-3" />RECOMMENDED<Star className="w-3 h-3" /></span> section</li>
              <li>Toggle <strong>"Use custom email for notifications"</strong></li>
              <li>Enter your preferred email address</li>
              <li>Save your changes</li>
            </ol>

            <div className="mt-2 p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
              <p className="text-sm text-pink-700 font-medium">💌 Pro tip:</p>
              <p className="text-xs text-gray-600">Use an email you check regularly to stay connected!</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={onRemindLater}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg text-sm py-2"
            >
              Remind me later
            </Button>
            <Button 
              variant="outline" 
              onClick={onNeverShow}
              className="flex-1 border-pink-300 text-pink-700 hover:bg-pink-50 text-sm py-2"
            >
              Don't show again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
