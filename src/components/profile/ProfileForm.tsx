
import React, { useState, useEffect } from "react";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { useProfileOperations } from "@/hooks/useProfileOperations";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import the new section components
import { PhotosSection } from "./sections/PhotosSection";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { LanguageSection } from "./sections/LanguageSection";
import { HobbiesSection } from "./sections/HobbiesSection";
import { AdditionalQuestionsSection } from "./sections/AdditionalQuestionsSection";

interface ProfileFormProps {
  profile: any;
  onCancel: () => void;
}

export function ProfileForm({ profile, onCancel }: ProfileFormProps) {
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

  const { loading, handleSubmit } = useProfileOperations();
  const { toast } = useToast();
  const form = useForm();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const handleAdditionalDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdditionalData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageLevelChange = (language: string, level: number) => {
    setFormData(prev => {
      const updatedLanguageLevels = { ...prev.languageLevels, [language]: level };
      return { ...prev, languageLevels: updatedLanguageLevels };
    });
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, formData, additionalData, images);
  };

  return (
    <div className="container py-12 pb-32">
      <h1 className="text-3xl font-bold text-center mb-2">Profile Setup</h1>
      <p className="text-center text-gray-600 mb-8">Tell us about yourself</p>
      
      <Form {...form}>
        <form onSubmit={onSubmitForm} className="space-y-8">
          {/* Photos Section */}
          <PhotosSection
            images={images}
            setImages={setImages}
            hobbyPhotoComment={formData.hobbyPhotoComment}
            petPhotoComment={formData.petPhotoComment}
            onCommentChange={handleInputChange}
            loading={loading}
          />

          {/* Basic Information */}
          <BasicInfoSection
            firstName={formData.firstName}
            lastName={formData.lastName}
            university={formData.university}
            department={formData.department}
            year={formData.year}
            age={formData.age}
            gender={formData.gender}
            origin={formData.origin}
            sexuality={formData.sexuality}
            aboutMe={formData.aboutMe}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            loading={loading}
          />
          
          {/* Language Skills */}
          <LanguageSection
            languages={formData.languages}
            languageLevels={formData.languageLevels}
            learningLanguages={formData.learning_languages}
            onMultiSelectChange={handleMultiSelectChange}
            onLanguageLevelChange={handleLanguageLevelChange}
            loading={loading}
          />
          
          {/* Hobbies & Interests */}
          <HobbiesSection
            hobbies={formData.hobbies}
            onMultiSelectChange={handleMultiSelectChange}
            loading={loading}
          />

          {/* Additional Information */}
          <AdditionalQuestionsSection
            worstNightmare={additionalData.worstNightmare}
            friendActivity={additionalData.friendActivity}
            bestQuality={additionalData.bestQuality}
            superpower={additionalData.superpower}
            lifeGoal={additionalData.lifeGoal}
            onChange={handleAdditionalDataChange}
            loading={loading}
          />

          {/* Submit button - Changed to purple */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full"
            >
              {loading ? "送信中..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
