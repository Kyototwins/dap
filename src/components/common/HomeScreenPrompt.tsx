
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";

export function HomeScreenPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  
  // Check if the user has dismissed the prompt before
  useEffect(() => {
    const hasShownPrompt = localStorage.getItem("hasShownHomeScreenPrompt");
    
    if (!hasShownPrompt) {
      // Only show for mobile devices that aren't already in standalone mode
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
      
      // Check if it's not a Windows Phone (which has MSStream)
      // Safely check for MSStream by using a type assertion
      const isWindowsPhone = typeof window !== 'undefined' && 
        'MSStream' in window && !!(window as any).MSStream;
      
      // Only show if it's a relevant mobile device that's not in standalone mode and not Windows Phone
      if (isMobile && !isStandalone && !isWindowsPhone && (isIOS || isAndroid)) {
        setIsOpen(true);
      } else {
        // Mark as shown for non-relevant devices
        localStorage.setItem("hasShownHomeScreenPrompt", "true");
      }
    }
  }, []);
  
  const handleDismiss = (dontShowAgain = false) => {
    setIsOpen(false);
    
    if (dontShowAgain) {
      localStorage.setItem("hasShownHomeScreenPrompt", "true");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("homeScreen.title")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleDismiss()}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <h3 className="font-medium">{t("homeScreen.subtitle")}</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">📱 Android:</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>{t("homeScreen.android.step1")}</li>
                <li>{t("homeScreen.android.step2")}</li>
                <li>{t("homeScreen.android.step3")}</li>
                <li>{t("homeScreen.android.step4")}</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">🍎 iPhone (Safari):</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>{t("homeScreen.ios.step1")}</li>
                <li>{t("homeScreen.ios.step2")}</li>
                <li>{t("homeScreen.ios.step3")}</li>
                <li>{t("homeScreen.ios.step4")}</li>
              </ol>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={() => handleDismiss(true)}
            className="w-full sm:w-auto"
          >
            {t("homeScreen.dontShowAgain")}
          </Button>
          <Button
            onClick={() => handleDismiss()}
            className="w-full sm:w-auto"
          >
            {t("homeScreen.gotIt")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
