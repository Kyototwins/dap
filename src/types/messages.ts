
// This is an extension of the file, only adding what's missing
import { Database } from "@/integrations/supabase/types";

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  otherUser: Profile;
  lastMessage?: {
    content: string;
    created_at: string;
  };
  unreadCount: number;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  about_me: string | null;
  age: number | null;
  gender: string | null;
  university: string | null;
  department: string | null;
  year: string | null;
  hobbies: string[] | null;
  languages: string[] | null;
  language_levels: Record<string, number> | null;
  superpower: string | null;
  learning_languages: string[] | null;
  origin: string | null;
  sexuality: string | null;
  ideal_date: string | null;
  life_goal: string | null;
  image_url_1: string | null;
  image_url_2: string | null;
  created_at: string;
  photo_comment: string | null;
  worst_nightmare: string | null;
  friend_activity: string | null;
  best_quality: string | null;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  match_id: string;
  sender_id: string;
  sender: Profile;
}
