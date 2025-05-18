
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/hooks/useLanguage";

export function HomeScreenPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  
  // Check if the user has dismissed the prompt before
  useEffect(() => {
    // Small delay to ensure it appears after login
    const timer = setTimeout(() => {
      const hasShownPrompt = localStorage.getItem("hasShownHomeScreenPrompt");
      
      if (!hasShownPrompt) {
        // Only show for mobile devices that aren't already in standalone mode
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);
        
        // Check if it's not a Windows Phone
        const ua = navigator.userAgent;
        const isWindowsPhone = ua.indexOf("Windows Phone") !== -1 || (typeof window !== 'undefined' && 'MSStream' in window);
        
        // Only show if it's a relevant mobile device that's not in standalone mode and not Windows Phone
        if (isMobile && !isStandalone && !isWindowsPhone && (isIOS || isAndroid)) {
          setIsOpen(true);
        } else {
          // Mark as shown for non-relevant devices
          localStorage.setItem("hasShownHomeScreenPrompt", "true");
        }
      }
    }, 1000); // 1 second delay
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleDismiss = (dontShowAgain = false) => {
    setIsOpen(false);
    
    if (dontShowAgain) {
      localStorage.setItem("hasShownHomeScreenPrompt", "true");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="w-[70vw] max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">
            {t("homeScreen.title")}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDismiss()}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4 p-4">
          <h4 className="font-medium">{t("homeScreen.subtitle")}</h4>
          
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
        
        <div className="flex justify-end space-x-2 border-t p-4">
          <Button
            variant="secondary"
            onClick={() => handleDismiss(true)}
            size="sm"
          >
            {t("homeScreen.dontShowAgain")}
          </Button>
          <Button
            onClick={() => handleDismiss()}
            size="sm"
          >
            {t("homeScreen.gotIt")}
          </Button>
        </div>
      </div>
    </div>
  );
}
