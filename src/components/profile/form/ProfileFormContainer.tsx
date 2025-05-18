
import React, { useState, useEffect } from "react";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { useProfileOperations } from "@/hooks/useProfileOperations";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Import the section components
import { PhotosSection } from "@/components/profile/sections/PhotosSection";
import { BasicInfoSection } from "@/components/profile/sections/BasicInfoSection";
import { LanguageSection } from "@/components/profile/sections/LanguageSection";
import { HobbiesSection } from "@/components/profile/sections/HobbiesSection";
import { AdditionalQuestionsSection } from "@/components/profile/sections/AdditionalQuestionsSection";
import { useInitialFormData } from "../form/useInitialFormData";

interface ProfileFormContainerProps {
  profile: any;
  onCancel: () => void;
}

export function ProfileFormContainer({ profile, onCancel }: ProfileFormContainerProps) {
  const { formData, setFormData, additionalData, setAdditionalData, images, setImages } = useInitialFormData(profile);
  const { loading, handleSubmit } = useProfileOperations();
  const form = useForm();
  const navigate = useNavigate();

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

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e, formData, additionalData, images);
    // Navigate to profile page after successful submission
    navigate("/profile");
  };

  return (
    <div className="container py-12 pb-32">
      <h1 className="text-3xl font-bold text-center mb-2">Profile Setup</h1>
      <p className="text-center text-gray-600 mb-8">Tell us about yourself</p>
      
      <Form {...form}>
        <form onSubmit={onSubmitForm} className="space-y-8">
          {/* Photos Section - now including name and about me */}
          <PhotosSection
            images={images}
            setImages={setImages}
            hobbyPhotoComment={formData.hobbyPhotoComment}
            petPhotoComment={formData.petPhotoComment}
            firstName={formData.firstName}
            lastName={formData.lastName}
            aboutMe={formData.aboutMe}
            onInputChange={handleInputChange}
            onCommentChange={handleInputChange}
            loading={loading}
          />

          {/* Basic Information - now without name and about me */}
          <BasicInfoSection
            university={formData.university}
            department={formData.department}
            year={formData.year}
            age={formData.age}
            gender={formData.gender}
            origin={formData.origin}
            sexuality={formData.sexuality}
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

          {/* Submit button - Updated to the specific purple color */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#7F1184] hover:bg-[#671073] text-white px-6 py-3 rounded-full"
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
