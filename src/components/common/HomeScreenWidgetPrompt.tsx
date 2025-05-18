
import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function HomeScreenWidgetPrompt() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Show the popover after a 1 second delay
    const timer = setTimeout(() => {
      setOpen(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (dontShowAgain = false) => {
    setOpen(false);
    
    if (dontShowAgain) {
      localStorage.setItem("hasShownWidgetPrompt", "true");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="hidden">
        {/* Hidden trigger */}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[70vw] p-6 mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-lg border border-gray-200"
        align="center"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <Smartphone className="h-12 w-12 text-doshisha-purple animate-pulse" />
            <h3 className="text-xl font-bold">{t("homeScreen.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("homeScreen.subtitle")}
            </p>
          </div>
          
          <div className="space-y-3 mt-2">
            <p className="font-medium text-center">{t("homeScreen.addWidget")}</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-semibold mb-1">📱 {t("homeScreen.howToAdd")}</p>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>{t("homeScreen.android.step1")}</li>
                <li>{t("homeScreen.android.step2")}</li>
                <li>{t("homeScreen.android.step3")}</li>
              </ol>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <Button 
              className="w-full bg-doshisha-purple hover:bg-doshisha-purple/90" 
              onClick={() => handleDismiss()}
            >
              {t("homeScreen.gotIt")}
            </Button>
            <Button
              variant="outline"
              className="w-full" 
              onClick={() => handleDismiss(true)}
            >
              {t("homeScreen.dontShowAgain")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
