
export interface FilterState {
  ageRange: [number, number];
  speakingLanguages: string[];
  learningLanguages: string[];
  minLanguageLevel: number;
  hobbies: string[];
  countries: string[];
  sortOption: string;
}

// Make Match type compatible with the one in messages.ts
export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string; // Changed from optional to required
  status: string;
  otherUser?: any;
  lastMessage?: any;
  unreadCount?: number;
}
