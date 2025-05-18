
import { useState, useEffect, useCallback } from "react";
import { fetchUserProfile as apiFetchUserProfile } from "@/services/profileService";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { useAuth } from "@/hooks/useAuth";
import { processLanguageLevels } from "@/utils/profileDataUtils";

export function useProfileFetching() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return null;
    }

    try {
      setIsLoading(true);
      
      // モックユーザーの場合はモックプロフィールを返す
      if (user.id === "mock-user-id") {
        const mockProfile: Profile = {
          id: "mock-user-id",
          created_at: new Date().toISOString(),
          first_name: "太郎",
          last_name: "同志社",
          age: 22,
          gender: "male",
          origin: "japan",
          about_me: "同志社大学の学生です。国際交流に興味があります。",
          university: "同志社大学",
          department: "国際学部",
          year: "3年生",
          avatar_url: "/lovable-uploads/dcec855f-513e-4a70-aae4-fa4c16529c99.png",
          image_url_1: "/lovable-uploads/78b54ef9-c522-4028-bca2-1864dd1be91f.png",
          image_url_2: "/lovable-uploads/cf0627b7-21bb-46d7-9945-f300b3511965.png",
          hobbies: ["読書", "旅行", "写真", "料理"],
          languages: ["日本語", "英語"],
          language_levels: {
            "日本語": 5,
            "英語": 3
          },
          learning_languages: ["中国語", "フランス語"],
          ideal_date: "カフェでゆっくり話すこと",
          life_goal: "色々な国の友達を作ること",
          superpower: "どこでも眠れる能力",
          sexuality: "straight",
          friend_activity: "カフェ巡り"
        };
        
        setProfile(mockProfile);
        setIsLoading(false);
        return mockProfile;
      }
      
      // 通常のユーザーの場合は API から取得
      const profileData = await apiFetchUserProfile(user.id);
      
      // Process the profile data to ensure language_levels is correctly formatted
      const processedProfile: Profile = {
        ...profileData,
        language_levels: profileData.language_levels 
          ? processLanguageLevels(profileData.language_levels)
          : {}
      };
      
      setProfile(processedProfile);
      setIsLoading(false);
      return processedProfile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error as Error);
      setIsLoading(false);
      return null;
    }
  }, [user?.id]);

  const refreshProfile = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  // Initial profile fetch
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { profile, isLoading, error, refreshProfile, fetchUserProfile };
}
