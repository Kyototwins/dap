
import { useState, useEffect } from "react";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";

export function useInitialFormData(profile: any) {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    origin: "",
    sexuality: "",
    aboutMe: "",
    university: "",
    department: "",
    year: "",
    hobbies: [],
    languages: [],
    languageLevels: {},
    learning_languages: [],
    photoComment: "",
    hobbyPhotoComment: "",
    petPhotoComment: ""
  });

  const [additionalData, setAdditionalData] = useState<AdditionalDataType>({
    idealDate: "",
    lifeGoal: "",
    superpower: "",
    worstNightmare: "",
    friendActivity: "",
    bestQuality: ""
  });

  const [images, setImages] = useState<ImageUploadState>({
    avatar: { file: null, preview: "", uploading: false },
    image1: { file: null, preview: "", uploading: false },
    image2: { file: null, preview: "", uploading: false },
    hobby: { file: null, preview: "", uploading: false },
    pet: { file: null, preview: "", uploading: false }
  });

  useEffect(() => {
    if (profile) {
      // Parse language levels JSON if it's stored as a string
      let languageLevels = {};
      if (profile.language_levels) {
        try {
          languageLevels = typeof profile.language_levels === 'string'
            ? JSON.parse(profile.language_levels)
            : profile.language_levels;
        } catch (e) {
          console.error("Error parsing language levels:", e);
        }
      }

      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        age: profile.age ? profile.age.toString() : "",
        gender: profile.gender || "",
        origin: profile.origin || "",
        sexuality: profile.sexuality || "",
        aboutMe: profile.about_me || "",
        university: profile.university || "",
        department: profile.department || "",
        year: profile.year || "",
        hobbies: profile.hobbies || [],
        languages: profile.languages || [],
        languageLevels: languageLevels,
        learning_languages: profile.learning_languages || [],
        photoComment: profile.photo_comment || "",
        hobbyPhotoComment: profile.hobby_photo_comment || "",
        petPhotoComment: profile.pet_photo_comment || ""
      });

      setAdditionalData({
        idealDate: profile.ideal_date || "",
        lifeGoal: profile.life_goal || "",
        superpower: profile.superpower || "",
        worstNightmare: profile.worst_nightmare || "",
        friendActivity: profile.friend_activity || "",
        bestQuality: profile.best_quality || ""
      });

      setImages({
        avatar: { file: null, preview: profile.avatar_url || "", uploading: false },
        image1: { file: null, preview: profile.image_url_1 || "", uploading: false },
        image2: { file: null, preview: profile.image_url_2 || "", uploading: false },
        hobby: { file: null, preview: profile.hobby_photo_url || "", uploading: false },
        pet: { file: null, preview: profile.pet_photo_url || "", uploading: false }
      });
    }
  }, [profile]);

  return {
    formData,
    setFormData,
    additionalData,
    setAdditionalData,
    images,
    setImages
  };
}
