
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  content: string;
  related_id?: string;  // ID of related object (match, event, message, etc.)
  created_at: string;
  read: boolean;
}

export enum NotificationType {
  NEW_MATCH = "new_match",
  NEW_MESSAGE = "new_message",
  NEW_EVENT = "new_event",
  EVENT_JOIN = "event_join",
  EVENT_COMMENT = "event_comment"
}
