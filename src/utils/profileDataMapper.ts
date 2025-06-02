
import type { Profile } from "@/types/messages";

export const mapProfileData = (profileData: any): Profile => ({
  id: profileData.id,
  first_name: profileData.first_name || '',
  last_name: profileData.last_name || '',
  avatar_url: profileData.avatar_url || null,
  about_me: profileData.about_me || null,
  age: profileData.age || null,
  gender: profileData.gender || null,
  university: profileData.university || null,
  department: profileData.department || '',
  year: profileData.year || '',
  hobbies: profileData.hobbies || [],
  languages: profileData.languages || [],
  language_levels: profileData.language_levels as Record<string, number>,
  superpower: profileData.superpower || '',
  learning_languages: profileData.learning_languages || [],
  origin: profileData.origin || null,
  ideal_date: profileData.ideal_date || null,
  life_goal: profileData.life_goal || null,
  image_url_1: profileData.image_url_1 || null,
  image_url_2: profileData.image_url_2 || null,
  created_at: profileData.created_at || '',
  photo_comment: profileData.photo_comment || null,
  worst_nightmare: profileData.worst_nightmare || null,
  friend_activity: profileData.friend_activity || null,
  best_quality: profileData.best_quality || null,
  hobby_photo_url: null,
  pet_photo_url: null,
  hobby_photo_comment: null,
  pet_photo_comment: null
});
