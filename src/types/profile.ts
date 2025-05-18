
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
  pet: ImageUpload;
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
  petPhotoComment: string;
}

export interface AdditionalDataType {
  idealDate: string;
  lifeGoal: string;
  superpower: string;
  worstNightmare: string;
  friendActivity: string;
  bestQuality: string;
}

// Update the Profile interface to ensure it's compatible with the one in messages.ts
export interface Profile {
  id: string;
  created_at: string;
  first_name?: string | null;
  last_name?: string | null;
  age?: number | null;
  gender?: string | null;
  origin?: string | null;
  about_me?: string | null;
  university?: string | null;
  department?: string | null;
  year?: string | null;
  hobbies?: string[] | null;
  languages?: string[] | null;
  language_levels?: Record<string, number> | string | null;
  learning_languages?: string[] | null;
  avatar_url?: string | null;
  image_url_1?: string | null;
  image_url_2?: string | null;
  hobby_photo_url?: string | null;
  pet_photo_url?: string | null;
  photo_comment?: string | null;
  hobby_photo_comment?: string | null;
  pet_photo_comment?: string | null;
  ideal_date?: string | null;
  life_goal?: string | null;
  superpower?: string | null;
  worst_nightmare?: string | null;
  friend_activity?: string | null;
  best_quality?: string | null;
  sexuality?: string | null;
  fcm_token?: string | null;
  email_digest_enabled?: boolean | null;
}
