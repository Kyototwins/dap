
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  about_me: string | null;
  age: number | null;
  gender: string | null;
  ideal_date: string | null;
  image_url_1: string | null;
  image_url_2: string | null;
  life_goal: string | null;
  origin: string | null;
  sexuality: string | null;
  superpower: string | null;
  university: string | null;
  department: string | null;
  year: string | null;
  hobbies: string[] | null;
  languages: string[] | null;
  language_levels: string | null | Record<string, number>;
  learning_languages: string[] | null;
  created_at: string | null;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: Profile;
  match_id: string;
  sender_id: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  otherUser: Profile;
  lastMessage?: {
    content: string;
    created_at: string;
  };
}
