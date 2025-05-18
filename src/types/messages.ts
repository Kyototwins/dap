
// Define the message type
export interface Message {
  id: string;
  created_at: string;
  content: string;
  sender_id: string;
  receiver_id?: string;
  match_id?: string;
  sender?: Profile;
}

export interface Profile {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  gender: string | null;
  origin: string | null;
  about_me: string | null;
  avatar_url: string | null;
  sexuality: string | null;
  university: string | null;
  department: string | null;
  year: string | null;
  image_url_1?: string | null;
  image_url_2?: string | null;
  ideal_date?: string | null;
  life_goal?: string | null;
  superpower?: string | null;
  worst_nightmare?: string | null;
  friend_activity?: string | null;
  best_quality?: string | null;
  photo_comment?: string | null;
  hobby_photo_url?: string | null;
  hobby_photo_comment?: string | null;
  hobbies?: string[] | null;
  languages?: string[] | null;
  learning_languages?: string[] | null;
  language_levels?: Record<string, number> | string | null;
  pet_photo_url?: string | null;
  pet_photo_comment?: string | null;
}

export interface Match {
  id: string;
  created_at: string;
  user1_id: string;
  user2_id: string;
  status?: string;
  user1_last_read?: string;
  user2_last_read?: string;
  otherUser?: Profile;
  lastMessage?: {
    id?: string;
    content: string;
    created_at: string;
    match_id?: string;
    sender_id?: string;
  };
  unreadCount?: number;
}
