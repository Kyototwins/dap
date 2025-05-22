
export interface Profile {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email_digest_enabled: boolean | null;
  notification_email: string | null;
  notification_time: string | null; // Add notification_time property
  avatar_url: string | null;
  about_me: string | null;
  age: number | null;
  gender: string | null;
  origin: string | null;
  sexuality: string | null;
  university: string | null;
  department: string | null;
  year: string | null;
  image_url_1: string | null;
  image_url_2: string | null;
  hobbies: string[] | null;
  languages: string[] | null;
  language_levels: Record<string, number> | null;
  learning_languages: string[] | null;
  ideal_date: string | null;
  life_goal: string | null;
  superpower: string | null;
  photo_comment: string | null;
  hobby_photo_url: string | null;
  hobby_photo_comment: string | null;
  pet_photo_url: string | null;
  pet_photo_comment: string | null;
  worst_nightmare: string | null;
  friend_activity: string | null;
  best_quality: string | null;
  fcm_token: string | null;
}

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

// Add Message type definition that was missing
export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  match_id: string;
}

// Add Match type definition that was missing
export interface Match {
  id: string;
  status: string;
  user1_id: string;
  user2_id: string;
  otherUser: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  lastMessage?: {
    content: string;
    created_at: string;
  };
  unreadCount?: number;
}
