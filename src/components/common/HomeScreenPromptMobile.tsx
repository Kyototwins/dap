
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useLanguage } from "@/hooks/useLanguage";

export function HomeScreenPromptMobile() {
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
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle>{t("homeScreen.title")}</DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleDismiss()}
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="px-4 space-y-4 py-2">
          <h3 className="font-medium text-center">{t("homeScreen.subtitle")}</h3>
          
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
        
        <DrawerFooter className="flex flex-col gap-2 px-4">
          <Button
            variant="secondary"
            onClick={() => handleDismiss(true)}
            className="w-full"
          >
            {t("homeScreen.dontShowAgain")}
          </Button>
          <Button
            onClick={() => handleDismiss()}
            className="w-full"
          >
            {t("homeScreen.gotIt")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
