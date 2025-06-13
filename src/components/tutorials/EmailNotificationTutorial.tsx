import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Settings } from "lucide-react";
interface EmailNotificationTutorialProps {
  open: boolean;
  onRemindLater: () => void;
  onNeverShow: () => void;
}
export function EmailNotificationTutorial({
  open,
  onRemindLater,
  onNeverShow
}: EmailNotificationTutorialProps) {
  return <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold text-pink-800 mb-2 mx-[25px]">Change Your Notification Email  
よく見るメールに変更しよう</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 px-1">
          <div className="text-center">
            <Mail className="w-12 h-12 mx-auto text-pink-600 mb-2" />
            <p className="text-gray-700 text-sm">Currently using your university email</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <h3 className="font-bold text-pink-700 mb-2 flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4" />
              How to change:
            </h3>
            
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Go to <strong>Profile</strong></li>
              <li>Tap <strong>Notification Settings</strong></li>
              <li>Change email address</li>
            </ol>

            <div className="mt-3 p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
              <p className="text-sm text-pink-700 font-medium">💡 Use an email you check often!</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t bg-gradient-to-br from-pink-50 to-purple-50">
          <Button onClick={onRemindLater} className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg text-sm py-2">
            Remind me later
          </Button>
          <Button variant="outline" onClick={onNeverShow} className="flex-1 border-pink-300 text-pink-700 hover:bg-pink-50 text-sm py-2">
            Don't show again
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
}