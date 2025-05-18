import { Profile } from '@/types/messages';

// Process language_levels field to handle both string and Record format
export const processProfile = (profile: any): Profile => {
  // Parse language_levels if it's a string
  let processedLanguageLevels = profile.language_levels;
  if (typeof profile.language_levels === 'string') {
    try {
      processedLanguageLevels = JSON.parse(profile.language_levels);
    } catch (e) {
      console.error("Error parsing language levels:", e);
      // Keep it as is if parsing fails
    }
  }
  
  return {
    ...profile,
    language_levels: processedLanguageLevels,
    fcm_token: profile.fcm_token ?? null
  } as Profile;
};
