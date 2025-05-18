
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";

export function HomeScreenPrompt() {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();
  
  const handleDismiss = (dontShowAgain = false) => {
    setOpen(false);
    
    if (dontShowAgain) {
      localStorage.setItem("hasShownHomeScreenPrompt", "true");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("homeScreen.title")}</DialogTitle>
          <DialogDescription>
            {t("homeScreen.subtitle")}
          </DialogDescription>
        </DialogHeader>
        
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
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="secondary"
            onClick={() => handleDismiss(true)}
          >
            {t("homeScreen.dontShowAgain")}
          </Button>
          <Button
            onClick={() => handleDismiss()}
          >
            {t("homeScreen.gotIt")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
