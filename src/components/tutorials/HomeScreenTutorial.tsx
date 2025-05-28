
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, Share, Home, Plus } from "lucide-react";

interface HomeScreenTutorialProps {
  open: boolean;
  onRemindLater: () => void;
  onNeverShow: () => void;
}

export function HomeScreenTutorial({ open, onRemindLater, onNeverShow }: HomeScreenTutorialProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-purple-800 mb-4">
            🌟 Recommended! Add DAP to Your Home Screen! 🌟
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <Smartphone className="w-16 h-16 mx-auto text-purple-600 mb-2" />
            <p className="text-gray-700">Access DAP instantly like a native app!</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                <span>📱</span> iOS (Safari)
              </h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Open this website in Safari</li>
                <li>Tap the share button <Share className="w-4 h-4 inline" /> at the bottom</li>
                <li>Select "Add to Home Screen"</li>
                <li>Edit the name if needed and tap "Add"</li>
              </ol>
              <p className="text-xs text-purple-600 mt-2">→ App icon will appear on your home screen!</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                <span>🤖</span> Android (Chrome)
              </h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Open this website in Chrome</li>
                <li>Tap the menu "⋮" in the top right</li>
                <li>Select "Add to Home screen"</li>
                <li>Edit the name if needed and tap "Add"</li>
                <li>Choose "Automatic" or "Manual placement"</li>
              </ol>
              <p className="text-xs text-purple-600 mt-2">→ App-like shortcut will be created!</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onRemindLater}
              className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Remind me later
            </Button>
            <Button 
              onClick={onNeverShow}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Don't show again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
