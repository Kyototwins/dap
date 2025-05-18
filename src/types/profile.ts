
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
