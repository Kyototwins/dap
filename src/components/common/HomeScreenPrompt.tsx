
import React, { useState, useEffect } from 'react';
import { Apple, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';

const PROMPT_DISMISSED_KEY = 'home-screen-prompt-dismissed';

export function HomeScreenPrompt() {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  
  // Only show on mobile devices
  useEffect(() => {
    setIsMounted(true);
    
    // Check if user has dismissed the prompt before
    const isDismissed = localStorage.getItem(PROMPT_DISMISSED_KEY) === 'true';
    
    // Check if app is already installed (PWA detection)
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    
    // Only show if on mobile, not dismissed, and not already installed as PWA
    if (isMobile && !isDismissed && !isPWA) {
      // Small delay to avoid showing immediately on page load
      const timer = setTimeout(() => {
        setOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile]);
  
  // Don't render anything on server or when not mounted yet
  if (!isMounted) return null;
  
  // Don't bother showing if not mobile
  if (!isMobile) return null;
  
  const handleDismissForever = () => {
    localStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
    setOpen(false);
  };
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const defaultTab = isIOS ? 'ios' : 'android';
  
  const translations = {
    title: {
      en: 'Add to Home Screen',
      ja: 'ホーム画面に追加',
    },
    subtitle: {
      en: 'Get quick access to DAP from your home screen',
      ja: 'ホーム画面からDAPにすばやくアクセス',
    },
    android: {
      en: 'Android',
      ja: 'Android',
    },
    ios: {
      en: 'iPhone',
      ja: 'iPhone',
    },
    step1Android: {
      en: '1. Open this app in Chrome',
      ja: '1. Chromeでこのアプリを開く',
    },
    step2Android: {
      en: '2. Tap the menu icon (⋮) in the top right',
      ja: '2. 画面右上「︙（メニュー）」をタップ',
    },
    step3Android: {
      en: '3. Select "Add to Home screen"',
      ja: '3. 「ホーム画面に追加」を選択',
    },
    step4Android: {
      en: '4. Tap "Add" to complete!',
      ja: '4. 「追加」をタップで完了！',
    },
    step1iOS: {
      en: '1. Open this app in Safari',
      ja: '1. Safariでこのアプリを開く',
    },
    step2iOS: {
      en: '2. Tap the share icon (□↑) at the bottom',
      ja: '2. 画面下の「共有アイコン（□に↑）」をタップ',
    },
    step3iOS: {
      en: '3. Select "Add to Home Screen"',
      ja: '3. 「ホーム画面に追加」を選ぶ',
    },
    step4iOS: {
      en: '4. Tap "Add" to complete!',
      ja: '4. 「追加」をタップで完了！',
    },
    dontShowAgain: {
      en: "Don't show again",
      ja: '今後表示しない',
    },
    close: {
      en: 'Close',
      ja: '閉じる',
    },
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {translations.title[language]}
          </DialogTitle>
          <DialogDescription className="text-center">
            {translations.subtitle[language]}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="android" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              {translations.android[language]}
            </TabsTrigger>
            <TabsTrigger value="ios" className="flex items-center gap-2">
              <Apple className="h-4 w-4" />
              {translations.ios[language]}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="android" className="space-y-4 px-1">
            <div className="bg-amber-50 rounded-lg p-4 space-y-2.5">
              <p className="text-sm">{translations.step1Android[language]}</p>
              <p className="text-sm">{translations.step2Android[language]}</p>
              <p className="text-sm">{translations.step3Android[language]}</p>
              <p className="text-sm">{translations.step4Android[language]}</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ios" className="space-y-4 px-1">
            <div className="bg-amber-50 rounded-lg p-4 space-y-2.5">
              <p className="text-sm">{translations.step1iOS[language]}</p>
              <p className="text-sm">{translations.step2iOS[language]}</p>
              <p className="text-sm">{translations.step3iOS[language]}</p>
              <p className="text-sm">{translations.step4iOS[language]}</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Apple className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            variant="outline"
            className="sm:flex-1 text-sm"
            onClick={handleDismissForever}
          >
            {translations.dontShowAgain[language]}
          </Button>
          <DialogClose asChild>
            <Button className="sm:flex-1">
              {translations.close[language]}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
