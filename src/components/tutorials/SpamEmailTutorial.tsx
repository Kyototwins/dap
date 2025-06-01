
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle, Settings, Star, Sparkles } from "lucide-react";

interface SpamEmailTutorialProps {
  open: boolean;
  onRemindLater: () => void;
  onNeverShow: () => void;
}

export function SpamEmailTutorial({ open, onRemindLater, onNeverShow }: SpamEmailTutorialProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold text-pink-800 mb-2">
            ⚠️ Important: Check Your Spam Folder! ⚠️
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 px-1">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-orange-600 mb-1" />
          </div>

          <div className="bg-white rounded-lg p-3 border border-pink-200">
            <div className="space-y-3">
              {/* English */}
              <div>
                <h3 className="font-bold text-pink-700 mb-2 flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  Notification emails might be in your spam folder
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Please check your spam/junk folder and mark our emails as "Not Spam" to ensure you receive important notifications.
                </p>
                <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg mb-3">
                  <p className="text-sm text-pink-700 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    We recommend customizing your notification email!
                    <Star className="w-3 h-3" />
                  </p>
                </div>
              </div>

              {/* Japanese */}
              <div className="border-t pt-3">
                <h3 className="font-bold text-pink-700 mb-2 flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  通知メールが迷惑メールフォルダに入っている可能性があります
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  迷惑メール/ジャンクフォルダをご確認いただき、当サービスからのメールを「迷惑メールではない」としてマークしてください。
                </p>
                <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                  <p className="text-sm text-pink-700 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    通知メールのカスタマイズを推奨します！
                    <Star className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                <Settings className="w-3 h-3" />
                Go to Profile → Notification Settings to customize your email
              </p>
              <p className="text-xs text-blue-700 mt-1">
                プロフィール → 通知設定 でメールをカスタマイズできます
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t bg-gradient-to-br from-pink-50 to-purple-50">
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
      </DialogContent>
    </Dialog>
  );
}
