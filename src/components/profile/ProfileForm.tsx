
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { LanguageSkillsInput } from "@/components/profile/LanguageSkillsInput";
import { HobbiesInput } from "@/components/profile/HobbiesInput";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  origin: string;
  sexuality: string;
  aboutMe: string;
  university: string;
  department: string;
  year: string;
  hobbies: string[];
  languages: string[];
  languageLevels: Record<string, number>;
  learning_languages: string[];
}

interface ProfileFormProps {
  formData: ProfileFormData;
  onChange: (name: string, value: string | string[] | Record<string, number>) => void;
  loading?: boolean;
}

export function ProfileForm({ formData, onChange, loading }: ProfileFormProps) {
  return (
    <>
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
    </>
  );
}
