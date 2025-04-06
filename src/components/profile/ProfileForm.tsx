
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { LanguageSkillsInput } from "@/components/profile/LanguageSkillsInput";
import { HobbiesInput } from "@/components/profile/HobbiesInput";
import { AdditionalQuestions } from "@/components/profile/AdditionalQuestions";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { Button } from "@/components/ui/button";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { ProfilePhotoCaption } from "./ProfilePhotoCaption";

interface ProfileFormProps {
  formData: ProfileFormData;
  additionalData: AdditionalDataType;
  images: ImageUploadState;
  onChange: (name: string, value: string | string[] | Record<string, number>) => void;
  onAdditionalChange: (name: string, value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'image1' | 'image2') => void;
  onPhotoCommentChange: (comment: string) => void;
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <ImageUpload
          label="Profile Picture (used as avatar)"
          image={images.avatar}
          onChange={(e) => onImageChange(e, 'avatar')}
          loading={loading}
        />
        <ImageUpload
          label="Cover Image"
          image={images.image1}
          onChange={(e) => onImageChange(e, 'image1')}
          loading={loading}
        />
        <ImageUpload
          label="Additional Photo"
          image={images.image2}
          onChange={(e) => onImageChange(e, 'image2')}
          loading={loading}
        />
        <ProfilePhotoCaption 
          caption={formData.photoComment || ''} 
          onChange={onPhotoCommentChange}
          loading={loading}
        />
      </div>

      <div className="space-y-4">
        <BasicInfoForm 
          formData={formData}
          onChange={onChange}
          loading={loading}
        />
        
        <LanguageSkillsInput
          languages={formData.languages}
          languageLevels={formData.languageLevels}
          learningLanguages={formData.learning_languages}
          onChange={onChange}
          loading={loading}
        />
        
        <HobbiesInput
          hobbies={formData.hobbies}
          onChange={onChange}
          loading={loading}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Additional Questions</h3>
        <AdditionalQuestions
          data={additionalData}
          onChange={onAdditionalChange}
          loading={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
