
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/messages";

export async function fetchProfiles(): Promise<Profile[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", user.id);

    if (error) throw error;
    
    // Map the data to match the Profile type with all required fields
    const typedProfiles = data?.map(profile => {
      // Check if notification_time exists in profile data
      const dbProfile = profile as any;
      
      return {
        id: dbProfile.id,
        created_at: dbProfile.created_at || '',
        first_name: dbProfile.first_name || null,
        last_name: dbProfile.last_name || null,
        email_digest_enabled: dbProfile.email_digest_enabled || false,
        notification_email: dbProfile.notification_email || null,
        notification_time: dbProfile.notification_time || null,
        fcm_token: dbProfile.fcm_token || null,
        avatar_url: dbProfile.avatar_url || null,
        about_me: dbProfile.about_me || null,
        age: dbProfile.age || null,
        gender: dbProfile.gender || null,
        origin: dbProfile.origin || null,
        sexuality: dbProfile.sexuality || null,
        university: dbProfile.university || null,
        department: dbProfile.department || null,
        year: dbProfile.year || null,
        image_url_1: dbProfile.image_url_1 || null,
        image_url_2: dbProfile.image_url_2 || null,
        hobbies: dbProfile.hobbies || null,
        languages: dbProfile.languages || null,
        language_levels: dbProfile.language_levels as Record<string, number> | null,
        learning_languages: dbProfile.learning_languages || null,
        ideal_date: dbProfile.ideal_date || null,
        life_goal: dbProfile.life_goal || null,
        superpower: dbProfile.superpower || null,
        photo_comment: dbProfile.photo_comment || null,
        hobby_photo_url: dbProfile.hobby_photo_url || null,
        hobby_photo_comment: dbProfile.hobby_photo_comment || null,
        pet_photo_url: dbProfile.pet_photo_url || null,
        pet_photo_comment: dbProfile.pet_photo_comment || null,
        worst_nightmare: dbProfile.worst_nightmare || null,
        friend_activity: dbProfile.friend_activity || null,
        best_quality: dbProfile.best_quality || null
      } as Profile;
    }) as Profile[];
    
    return typedProfiles || [];
  } catch (error: any) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
}
