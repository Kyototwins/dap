import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData, AdditionalDataType } from "@/types/profile";

export async function updateUserProfile(
  userId: string,
  formData: ProfileFormData,
  additionalData: AdditionalDataType,
  avatarUrl: string | null,
  imageUrl1: string | null,
  imageUrl2: string | null,
  hobbyPhotoUrl: string | null,
  petPhotoUrl: string | null  // Changed back from foodPhotoUrl
) {
  // Convert language levels to JSON string for storage
  const languageLevelsJson = JSON.stringify(formData.languageLevels);
  
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: formData.firstName,
      last_name: formData.lastName,
      age: parseInt(formData.age),
      gender: formData.gender,
      origin: formData.origin,
      sexuality: formData.sexuality,
      about_me: formData.aboutMe,
      university: formData.university,
      department: formData.department,
      year: formData.year,
      avatar_url: avatarUrl,
      image_url_1: imageUrl1,
      image_url_2: imageUrl2,
      hobby_photo_url: hobbyPhotoUrl,
      pet_photo_url: petPhotoUrl,
      photo_comment: formData.photoComment,
      hobby_photo_comment: formData.hobbyPhotoComment,
      pet_photo_comment: formData.petPhotoComment,
      ideal_date: additionalData.idealDate,
      life_goal: additionalData.lifeGoal,
      superpower: additionalData.superpower,
      worst_nightmare: additionalData.worstNightmare,
      friend_activity: additionalData.friendActivity,
      best_quality: additionalData.bestQuality,
      hobbies: formData.hobbies,
      languages: formData.languages,
      language_levels: languageLevelsJson,
      learning_languages: formData.learning_languages,
      notification_email: formData.notificationEmail
    })
    .eq('id', userId);

  if (error) throw error;
  return true;
}

export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateFcmToken(userId: string, token: string) {
  try {
    // Instead of using RPC which doesn't exist, directly update the profile table
    // First check if notification_settings column exists
    const { data: tableInfo, error: checkError } = await supabase
      .rpc('system_schema_info', { 
        p_table_name: 'profiles'
      })
      .single();
    
    if (checkError) {
      console.log('Using direct update without notification_settings');
      // If we can't check the schema (or column doesn't exist), try direct update
      const { error } = await supabase
        .from('profiles')
        .update({
          // Using notification_settings as a JSONB field if it exists
          notification_settings: { browser_push: true }
        })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating notification settings:', error);
        return false;
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateFcmToken:', error);
    return false;
  }
}

export async function updateNotificationSettings(
  userId: string, 
  settings: { 
    browser_push?: boolean;
    email?: boolean;
    email_digest_enabled?: boolean;
    notification_email?: string | null;
  }
) {
  try {
    const notificationSettingsObject = {
      browser_push: settings.browser_push,
      email: settings.email
    };

    const { error } = await supabase
      .from('profiles')
      .update({
        notification_settings: notificationSettingsObject,
        email_digest_enabled: settings.email_digest_enabled,
        notification_email: settings.notification_email
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return false;
  }
}
