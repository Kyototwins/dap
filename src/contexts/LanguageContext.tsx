
import React, { createContext, useState, useEffect } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const initialContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
};

export const LanguageContext = createContext<LanguageContextType>(initialContext);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const translations = {
  en: {
    'matching': 'Matching',
    'messages': 'Messages',
    'events': 'Events',
    'profile': 'Profile',
    'createEvent': 'Create Event',
    'save': 'Save',
    'saving': 'Saving...',
    'profileSetup': 'Profile Setup',
    'tellUsAboutYourself': 'Tell us about yourself',
    'hobbiesAndInterests': 'Hobbies & Interests',
    'additionalQuestions': 'Additional Questions',
    'whatMakesYouImpatient': 'What makes you most impatient?',
    'worstNightmare': 'What\'s your worst nightmare?',
    'friendActivity': 'If you could be friends with me, what would you want to do together?',
    'superpower': 'If you could have a superpower, what would it be?',
    'chooseImpatience': 'Choose what makes you impatient',
    'waitingInLine': 'Waiting in line',
    'traffic': 'Traffic',
    'slowInternet': 'Slow internet',
    'latePeople': 'People being late',
    'indecisiveness': 'Indecisiveness',
    'other': 'Other',
    'chooseSuperpower': 'Choose your superpower',
    'teleportation': 'Teleportation',
    'invisibility': 'Invisibility',
    'mindReading': 'Mind Reading',
    'timeTravel': 'Time Travel',
    'flying': 'Flying',
    'photoComment': 'Photo Comment',
    'aboutPhotoPlaceholder': 'Share something about this photo...',
    'customHobbyPlaceholder': 'Add your own hobby or interest',
    'yourCustomHobbies': 'Your custom hobbies',
    'profilePicture': 'Profile Picture (used as avatar)',
    'additionalPhoto': 'Additional photo',
    'worstNightmarePlaceholder': 'Tell us about your worst nightmare...',
    'friendActivityPlaceholder': 'What would you like us to do together as friends?',
    'addToHomeScreen': 'Add to Home Screen',
    'getQuickAccess': 'Get quick access to DAP from your home screen',
    'android': 'Android',
    'iphone': 'iPhone',
    'step1Android': '1. Open this app in Chrome',
    'step2Android': '2. Tap the menu icon (⋮) in the top right',
    'step3Android': '3. Select "Add to Home screen"',
    'step4Android': '4. Tap "Add" to complete!',
    'step1iOS': '1. Open this app in Safari',
    'step2iOS': '2. Tap the share icon (□↑) at the bottom',
    'step3iOS': '3. Select "Add to Home Screen"',
    'step4iOS': '4. Tap "Add" to complete!',
    'dontShowAgain': 'Don\'t show again',
    'close': 'Close',
  },
  ja: {
    'matching': 'マッチング',
    'messages': 'メッセージ',
    'events': 'イベント',
    'profile': 'プロフィール',
    'createEvent': 'イベントを作成',
    'save': 'プロフィールを保存',
    'saving': '保存中...',
    'profileSetup': 'プロフィール設定',
    'tellUsAboutYourself': 'あなたのことを教えてください',
    'hobbiesAndInterests': '趣味・興味',
    'additionalQuestions': '追加の質問',
    'whatMakesYouImpatient': '我慢できない頃は？',
    'worstNightmare': '最悪の悪夢は？',
    'friendActivity': 'あなたと友達になって一緒にしたいことは？',
    'superpower': 'もし超能力が使えるとしたら？',
    'chooseImpatience': '我慢できないことを選択',
    'waitingInLine': '列に並ぶこと',
    'traffic': '渋滞',
    'slowInternet': '遅いインターネット',
    'latePeople': '遅刻する人',
    'indecisiveness': '優柔不断',
    'other': 'その他',
    'chooseSuperpower': '超能力を選択',
    'teleportation': '瞬間移動',
    'invisibility': '透明化',
    'mindReading': '読心術',
    'timeTravel': '時間旅行',
    'flying': '空を飛ぶ',
    'photoComment': '写真のコメント',
    'aboutPhotoPlaceholder': 'この写真についての説明を共有...',
    'customHobbyPlaceholder': '自分の趣味や興味を追加',
    'yourCustomHobbies': 'あなたのカスタム趣味:',
    'profilePicture': 'プロフィール写真（アイコンとして使用）',
    'additionalPhoto': '追加の写真',
    'worstNightmarePlaceholder': 'あなたの最悪の悪夢について教えてください...',
    'friendActivityPlaceholder': '友達として何をしたいですか？',
    'addToHomeScreen': 'ホーム画面に追加',
    'getQuickAccess': 'ホーム画面からDAPにすばやくアクセス',
    'android': 'Android',
    'iphone': 'iPhone',
    'step1Android': '1. Chromeでこのアプリを開く',
    'step2Android': '2. 画面右上「︙（メニュー）」をタップ',
    'step3Android': '3. 「ホーム画面に追加」を選択',
    'step4Android': '4. 「追加」をタップで完了！',
    'step1iOS': '1. Safariでこのアプリを開く',
    'step2iOS': '2. 画面下の「共有アイコン（□に↑）」をタップ',
    'step3iOS': '3. 「ホーム画面に追加」を選ぶ',
    'step4iOS': '4. 「追加」をタップで完了！',
    'dontShowAgain': '今後表示しない',
    'close': '閉じる',
  }
};

// Fix: Define LanguageProvider properly as a React function component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage on client-side only
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-language');
      return (saved === 'ja' || saved === 'en') ? saved : 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
