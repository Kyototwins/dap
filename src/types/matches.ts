
export interface FilterState {
  ageRange: [number, number];
  speakingLanguages: string[];
  learningLanguages: string[];
  minLanguageLevel: number;
  hobbies: string[];
  countries: string[];
  sortOption: string;
}

// Add Match interface to fix the error in useMatches
export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  status: string;
  created_at?: string;
  otherUser?: any;
  lastMessage?: any;
  unreadCount?: number;
}
