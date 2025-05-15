
// Define the ImageUpload type
export interface ImageUpload {
  file: File | null;
  preview: string;
  uploading: boolean;
}

export interface ImageUploadState {
  avatar: ImageUpload;
  image1: ImageUpload;
  image2: ImageUpload;
  hobby: ImageUpload;
  pet: ImageUpload;  // Changed back from food to pet
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
  photoComment: string;
  hobbyPhotoComment: string;
  petPhotoComment: string;  // Changed back from foodPhotoComment
}

export interface AdditionalDataType {
  idealDate: string;
  lifeGoal: string;
  superpower: string;
  worstNightmare: string;
  friendActivity: string;
  bestQuality: string;
}

// Add the missing Profile type that's being imported in ProfileInfo.tsx
export interface Profile {
  id?: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: string;
  origin?: string;
  sexuality?: string;
  about_me?: string;
  university?: string;
  department?: string;
  year?: string;
  hobbies?: string[];
  languages?: string[];
  language_levels?: Record<string, number> | string;
  learning_languages?: string[];
  avatar_url?: string;
  image_url_1?: string;
  image_url_2?: string;
  hobby_photo_url?: string;
  pet_photo_url?: string;
  photo_comment?: string;
  hobby_photo_comment?: string;
  pet_photo_comment?: string;
  ideal_date?: string;
  life_goal?: string;
  superpower?: string;
  worst_nightmare?: string;
  friend_activity?: string;
  best_quality?: string;
  email_digest_enabled?: boolean;
  created_at?: string;  // Added the created_at property
}
