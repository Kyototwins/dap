
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

export interface Profile {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  origin?: string;
  gender?: string;
  age?: number;
  university?: string;
  department?: string;
  year?: string;
  about_me?: string;
  avatar_url?: string;
  image_url_1?: string;
  image_url_2?: string;
  photo_comment?: string;
  ideal_date?: string;
  life_goal?: string;
  superpower?: string;
  worst_nightmare?: string;
  friend_activity?: string;
  best_quality?: string;
  hobby_photo_url?: string;
  hobby_photo_comment?: string;
  pet_photo_url?: string;
  pet_photo_comment?: string;
  language_levels?: Record<string, number> | string;
  hobbies?: string[];
  languages?: string[];
  learning_languages?: string[];
  email_digest_enabled?: boolean;
  notification_email?: string;
  notification_time?: string;
}
