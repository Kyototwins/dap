
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
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold text-purple-800 mb-2">
            🌟 Recommended! Add DAP to Your Home Screen! 🌟
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="relative w-24 h-40 mx-auto mb-3">
              {/* Smartphone mockup */}
              <div className="w-full h-full bg-gray-900 rounded-2xl border-3 border-gray-800 relative overflow-hidden">
                {/* Screen */}
                <div className="absolute inset-1.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-1.5">
                  {/* Status bar */}
                  <div className="text-white text-xs flex justify-between items-center mb-1">
                    <span className="text-xs">10:25</span>
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                      <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                      <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* App icons grid */}
                  <div className="grid grid-cols-4 gap-1">
                    <div className="w-4 h-4 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📞</span>
                    </div>
                    <div className="w-4 h-4 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📧</span>
                    </div>
                    <div className="w-4 h-4 bg-red-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📸</span>
                    </div>
                    <div className="w-4 h-4 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">🎵</span>
                    </div>
                    
                    <div className="w-4 h-4 bg-purple-700 rounded-md flex items-center justify-center border border-yellow-400">
                      <span className="text-white text-xs font-bold">D</span>
                    </div>
                    <div className="w-4 h-4 bg-gray-500 rounded-md"></div>
                    <div className="w-4 h-4 bg-gray-500 rounded-md"></div>
                    <div className="w-4 h-4 bg-gray-500 rounded-md"></div>
                  </div>
                  
                  {/* Arrow pointing to DAP app */}
                  <div className="absolute -right-6 top-12">
                    <div className="text-yellow-400 text-sm">👆</div>
                    <div className="text-xs text-white bg-black bg-opacity-50 rounded px-1 mt-0.5">DAP</div>
                  </div>
                </div>
                
                {/* Home indicator */}
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-700 text-sm">Access DAP instantly like a native app!</p>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2 text-sm">
                <span>📱</span> iOS (Safari)
              </h3>
              <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                <li>Open this website in Safari</li>
                <li>Tap the share button <Share className="w-3 h-3 inline" /> at the bottom</li>
                <li>Select "Add to Home Screen"</li>
                <li>Edit the name if needed and tap "Add"</li>
              </ol>
              <p className="text-xs text-purple-600 mt-2">→ App icon will appear on your home screen!</p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2 text-sm">
                <span>🤖</span> Android (Chrome)
              </h3>
              <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                <li>Open this website in Chrome</li>
                <li>Tap the menu "⋮" in the top right</li>
                <li>Select "Add to Home screen"</li>
                <li>Edit the name if needed and tap "Add"</li>
                <li>Choose "Automatic" or "Manual placement"</li>
              </ol>
              <p className="text-xs text-purple-600 mt-2">→ App-like shortcut will be created!</p>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button 
              onClick={onRemindLater}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
            >
              Remind me later
            </Button>
            <Button 
              variant="outline" 
              onClick={onNeverShow}
              className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Don't show again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
