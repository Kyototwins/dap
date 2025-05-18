
export interface Message {
  id: string;
  content: string;
  created_at: string;
  match_id: string;
  sender_id: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    [key: string]: any;
  };
}

export interface Match {
  id: string;
  status: string;
  user1_id: string;
  user2_id: string;
  created_at?: string;
  otherUser: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    [key: string]: any;
  };
  lastMessage?: {
    content: string;
    created_at: string;
  };
  unreadCount: number;
}

export interface Profile {
  id: string;
  created_at?: string;
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
  superpower?: string;
  learning_languages?: string[];
  ideal_date?: string;
  life_goal?: string;
  avatar_url?: string | null;
  image_url_1?: string | null;
  image_url_2?: string | null;
  created_at?: string;
  photo_comment?: string | null;
  worst_nightmare?: string | null;
  friend_activity?: string | null;
  best_quality?: string | null;
  hobby_photo_url?: string | null;
  pet_photo_url?: string | null;
  hobby_photo_comment?: string | null;
  pet_photo_comment?: string | null;
  fcm_token?: string;
  email_digest_enabled?: boolean;
}
