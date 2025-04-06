
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={toggleLanguage}
      className="px-2 text-sm"
    >
      {language === 'en' ? '日本語' : 'EN'}
    </Button>
  );
}
