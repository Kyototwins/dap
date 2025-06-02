
import type { Profile } from "@/types/messages";

// プロフィール完了率を計算する関数
export const calculateProfileCompletion = (profile: Profile): number => {
  const fields = [
    'first_name', 'last_name', 'age', 'gender', 'origin', 'university',
    'department', 'about_me', 'avatar_url', 'languages'
  ];

  const completedFields = fields.filter(field => {
    if (Array.isArray(profile[field as keyof Profile])) {
      return (profile[field as keyof Profile] as any[]).length > 0;
    }
    return profile[field as keyof Profile] !== null && profile[field as keyof Profile] !== '';
  });

  return Math.round((completedFields.length / fields.length) * 100);
};

// ランダムに配列をシャッフルする関数
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
