
import { TimeFilter, CategoryFilter } from "@/components/events/EventFilters";

export interface EventCreator {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  location: string;
  date: string;
  max_participants: number;
  current_participants: number;
  creator_id: string;
  category: string;
  creator?: EventCreator;
}

export interface EventComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  event_id: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export interface EventParticipationMap {
  [key: string]: boolean;
}
