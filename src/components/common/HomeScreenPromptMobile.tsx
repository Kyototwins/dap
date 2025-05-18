
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function HomeScreenPromptMobile() {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();
  
  const handleDismiss = (dontShowAgain = false) => {
    setOpen(false);
    
    if (dontShowAgain) {
      localStorage.setItem("hasShownHomeScreenPrompt", "true");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("homeScreen.title", "Add to Home Screen")}</DrawerTitle>
          <DrawerDescription>
            {t("homeScreen.subtitle", "Install this app on your device for quick access")}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">📱 Android:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>{t("homeScreen.android.step1", "Tap the menu icon (three dots) in Chrome")}</li>
              <li>{t("homeScreen.android.step2", "Select 'Add to Home screen'")}</li>
              <li>{t("homeScreen.android.step3", "Choose a name if you want")}</li>
              <li>{t("homeScreen.android.step4", "Tap 'Add'")}</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">🍎 iPhone (Safari):</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>{t("homeScreen.ios.step1", "Tap the share icon at the bottom")}</li>
              <li>{t("homeScreen.ios.step2", "Scroll down and tap 'Add to Home Screen'")}</li>
              <li>{t("homeScreen.ios.step3", "Choose a name if you want")}</li>
              <li>{t("homeScreen.ios.step4", "Tap 'Add'")}</li>
            </ol>
          </div>
        </div>
        
        <DrawerFooter className="flex flex-row justify-between">
          <Button
            variant="outline"
            onClick={() => handleDismiss(true)}
          >
            {t("homeScreen.dontShowAgain", "Don't show again")}
          </Button>
          <Button onClick={() => handleDismiss()}>
            {t("homeScreen.gotIt", "Got it")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
