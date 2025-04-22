
import React from "react";
import { Button } from "@/components/ui/button";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { ProfilePhotoCaption } from "@/components/profile/ProfilePhotoCaption";
import { HobbiesInput } from "@/components/profile/HobbiesInput";
import { LanguageSkillsInput } from "@/components/profile/LanguageSkillsInput";
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { AdditionalInfo } from "@/components/profile/AdditionalInfo";

interface ProfileFormProps {
  formData: ProfileFormData;
  additionalData: AdditionalDataType;
  images: ImageUploadState;
  onChange: (name: string, value: string | string[] | Record<string, number>) => void;
  onAdditionalChange: (name: string, value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'image1' | 'image2' | 'hobby' | 'pet') => void;
  onPhotoCommentChange: (field: string, comment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function ProfileForm({
  formData,
  additionalData,
  images,
  onChange,
  onAdditionalChange,
  onImageChange,
  onPhotoCommentChange,
  onSubmit,
  loading
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Photos Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Profile Photos</h2>
        
        {/* Avatar upload - without comment */}
        <ImageUpload 
          label="Profile Photo" 
          image={images.avatar} 
          onChange={(e) => onImageChange(e, 'avatar')} 
          loading={loading} 
        />
        
        {/* Additional photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <ImageUpload 
              label="Header Photo" 
              image={images.image1} 
              onChange={(e) => onImageChange(e, 'image1')} 
              loading={loading} 
            />
          </div>
          <div>
            <ImageUpload 
              label="Additional Photo 2" 
              image={images.image2} 
              onChange={(e) => onImageChange(e, 'image2')} 
              loading={loading} 
            />
          </div>
        </div>
        
        {/* Hobby photo */}
        <ImageUpload 
          label="Photo of me enjoying my hobby" 
          image={images.hobby} 
          onChange={(e) => onImageChange(e, 'hobby')} 
          loading={loading} 
        />
        <ProfilePhotoCaption 
          caption={formData.hobbyPhotoComment || ''} 
          onChange={(text) => onPhotoCommentChange('hobbyPhotoComment', text)} 
          loading={loading} 
        />
        
        {/* Pet photo */}
        <ImageUpload 
          label="Photo of my pet/favorite animal" 
          image={images.pet} 
          onChange={(e) => onImageChange(e, 'pet')} 
          loading={loading} 
        />
        <ProfilePhotoCaption 
          caption={formData.petPhotoComment || ''} 
          onChange={(text) => onPhotoCommentChange('petPhotoComment', text)} 
          loading={loading} 
        />
      </div>

      {/* Basic Info Section */}
      <BasicInfoForm 
        formData={formData}
        onChange={onChange}
        loading={loading}
      />

      {/* Language Skills Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Language Skills</h2>
        <LanguageSkillsInput
          languages={formData.languages}
          languageLevels={formData.languageLevels}
          learningLanguages={formData.learning_languages}
          onChange={onChange}
          loading={loading}
        />
      </div>

      {/* Hobbies Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Hobbies & Interests</h2>
        <HobbiesInput
          hobbies={formData.hobbies}
          onChange={onChange}
          loading={loading}
        />
      </div>

      {/* Additional Questions Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Information</h2>
        <AdditionalInfo
          data={additionalData}
          onChange={onAdditionalChange}
          loading={loading}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
