
-- First, we need to drop the existing foreign key constraints that are causing the deletion error
ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS matches_user1_id_fkey;
ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS matches_user2_id_fkey;

-- Add new foreign key constraints with CASCADE deletion
ALTER TABLE public.matches 
ADD CONSTRAINT matches_user1_id_fkey 
FOREIGN KEY (user1_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.matches 
ADD CONSTRAINT matches_user2_id_fkey 
FOREIGN KEY (user2_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also update other tables that might have similar issues
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.event_participants DROP CONSTRAINT IF EXISTS event_participants_user_id_fkey;
ALTER TABLE public.event_participants 
ADD CONSTRAINT event_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.event_comments DROP CONSTRAINT IF EXISTS event_comments_user_id_fkey;
ALTER TABLE public.event_comments 
ADD CONSTRAINT event_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_creator_id_fkey;
ALTER TABLE public.events 
ADD CONSTRAINT events_creator_id_fkey 
FOREIGN KEY (creator_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.offered_experiences DROP CONSTRAINT IF EXISTS offered_experiences_user_id_fkey;
ALTER TABLE public.offered_experiences 
ADD CONSTRAINT offered_experiences_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
