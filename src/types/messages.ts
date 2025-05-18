
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
