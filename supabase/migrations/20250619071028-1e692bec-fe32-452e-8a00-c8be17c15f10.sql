
-- まず、messagesテーブルのmatch_id外部キー制約も修正する必要があります
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_match_id_fkey;
ALTER TABLE public.messages 
ADD CONSTRAINT messages_match_id_fkey 
FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;

-- さらに、event_commentsとeventsの関係も確認
ALTER TABLE public.event_comments DROP CONSTRAINT IF EXISTS event_comments_event_id_fkey;
ALTER TABLE public.event_comments 
ADD CONSTRAINT event_comments_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

-- event_participantsとeventsの関係も確認
ALTER TABLE public.event_participants DROP CONSTRAINT IF EXISTS event_participants_event_id_fkey;
ALTER TABLE public.event_participants 
ADD CONSTRAINT event_participants_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;
