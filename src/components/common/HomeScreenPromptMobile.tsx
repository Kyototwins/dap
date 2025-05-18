
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
          <DrawerTitle>{t("homeScreen.title")}</DrawerTitle>
          <DrawerDescription>
            {t("homeScreen.subtitle")}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 space-y-4">
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
        
        <DrawerFooter className="flex flex-row justify-between">
          <Button
            variant="outline"
            onClick={() => handleDismiss(true)}
          >
            {t("homeScreen.dontShowAgain")}
          </Button>
          <Button onClick={() => handleDismiss()}>
            {t("homeScreen.gotIt")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
