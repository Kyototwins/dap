
export interface ImageUpload {
  file: File | null;
  preview: string;
  uploading: boolean;
}

export interface ProfileFormData {
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
  photoComment?: string;
}

export interface AdditionalDataType {
  idealDate: string;
  lifeGoal: string;
  superpower: string;
  worstNightmare: string;
  friendActivity: string;
}

export interface ImageUploadState {
  avatar: ImageUpload;
  image1: ImageUpload;
  image2?: ImageUpload;
}
