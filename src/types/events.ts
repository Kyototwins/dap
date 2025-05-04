
import { TimeFilter, CategoryFilter } from "@/components/events/EventFilters";
import { SortOption } from "@/components/events/EventSortOptions";

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
  end_date?: string | null;
  max_participants: number;
  current_participants: number;
  creator_id: string;
  category: string;
  creator?: EventCreator;
  created_at: string;
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
