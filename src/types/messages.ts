
export interface FilterState {
  ageRange: [number, number];
  speakingLanguages: string[];
  learningLanguages: string[];
  minLanguageLevel: number;
  hobbies: string[];
  countries: string[];
  sortOption: string;
}

export interface Match {
  id: string;
  status: string;
  user1_id: string;
  user2_id: string;
  otherUser: Profile;
  lastMessage?: {
    content: string;
    created_at: string;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  match_id: string;
  sender_id: string;
  sender: Profile;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  about_me?: string;
  age?: number;
  gender?: string;
  ideal_date?: string;
  image_url_1?: string;
  image_url_2?: string;
  life_goal?: string;
  origin?: string;
  sexuality?: string;
  university?: string;
  department: string;
  year: string;
  hobbies: string[];
  languages: string[];
  language_levels: Record<string, number>;
  superpower: string;
  learning_languages: string[];
  created_at?: string;
  photo_comment: string | null;
  worst_nightmare: string | null;
  friend_activity: string | null;
  best_quality: string | null;
  hobby_photo_url: string | null;
  pet_photo_url: string | null;
  hobby_photo_comment: string | null;
  pet_photo_comment: string | null;
}
