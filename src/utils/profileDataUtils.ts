
/**
 * Utility functions for processing profile data
 */

/**
 * Processes language levels to ensure correct type format
 */
export const processLanguageLevels = (languageLevels: any): Record<string, number> => {
  let processedLanguageLevels: Record<string, number> = {};
  
  if (!languageLevels) return processedLanguageLevels;
  
  // If it's a string, try to parse it
  if (typeof languageLevels === 'string') {
    try {
      processedLanguageLevels = JSON.parse(languageLevels);
    } catch (e) {
      console.error("Error parsing language_levels:", e);
    }
  } 
  // If it's already an object, safely convert it to Record<string, number>
  else if (typeof languageLevels === 'object') {
    Object.entries(languageLevels).forEach(([key, value]) => {
      if (typeof value === 'number') {
        processedLanguageLevels[key] = value;
      } else if (typeof value === 'string' && !isNaN(Number(value))) {
        processedLanguageLevels[key] = Number(value);
      }
    });
  }
  
  return processedLanguageLevels;
};

/**
 * Creates a standardized user object with all required properties
 */
export const createStandardizedUserObject = (userData: any) => {
  if (!userData) return null;
  
  return {
    id: userData.id,
    first_name: userData.first_name || 'ユーザー',
    last_name: userData.last_name || '',
    avatar_url: userData.avatar_url,
    about_me: userData.about_me,
    age: userData.age,
    gender: userData.gender,
    ideal_date: userData.ideal_date,
    image_url_1: userData.image_url_1,
    image_url_2: userData.image_url_2,
    life_goal: userData.life_goal,
    origin: userData.origin,
    sexuality: userData.sexuality,
    university: userData.university,
    department: userData.department || '',
    year: userData.year || '',
    hobbies: userData.hobbies || [],
    languages: userData.languages || [],
    language_levels: processLanguageLevels(userData.language_levels),
    superpower: userData.superpower || '',
    learning_languages: userData.learning_languages || [],
    created_at: userData.created_at,
    photo_comment: userData.photo_comment || null,
    worst_nightmare: userData.worst_nightmare || null,
    friend_activity: userData.friend_activity || null,
    best_quality: userData.best_quality || null,
    hobby_photo_url: userData.hobby_photo_url || null,
    pet_photo_url: userData.pet_photo_url || null,
    hobby_photo_comment: userData.hobby_photo_comment || null,
    pet_photo_comment: userData.pet_photo_comment || null
  };
};
