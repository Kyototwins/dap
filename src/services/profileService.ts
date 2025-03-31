
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";

export async function updateUserProfile(
  userId: string,
  formData: ProfileFormData,
  additionalData: AdditionalDataType,
  avatarUrl: string | null,
  imageUrl1: string | null,
  imageUrl2: string | null
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
      ideal_date: additionalData.idealDate,
      life_goal: additionalData.lifeGoal,
      superpower: additionalData.superpower,
      hobbies: formData.hobbies,
      languages: formData.languages,
      language_levels: languageLevelsJson,
      learning_languages: formData.learning_languages
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
