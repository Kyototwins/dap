import { Profile } from '@/types/messages';

// Process language_levels field to handle both string and Record format
export const processProfile = (profile: any): Profile => {
  // Parse language_levels if it's a string
  let processedLanguageLevels: Record<string, number> = {};
  
  if (profile.language_levels) {
    if (typeof profile.language_levels === 'string') {
      try {
        processedLanguageLevels = JSON.parse(profile.language_levels);
      } catch (e) {
        console.error("Error parsing language levels:", e);
        // Keep it as empty object if parsing fails
      }
    } else if (typeof profile.language_levels === 'object') {
      // Convert to Record<string, number>
      Object.entries(profile.language_levels).forEach(([key, value]) => {
        if (typeof value === 'number') {
          processedLanguageLevels[key] = value;
        } else if (typeof value === 'string' && !isNaN(Number(value))) {
          processedLanguageLevels[key] = Number(value);
        }
      });
    }
  }
  
  return {
    ...profile,
    language_levels: processedLanguageLevels,
    fcm_token: profile.fcm_token ?? null
  } as Profile;
};
