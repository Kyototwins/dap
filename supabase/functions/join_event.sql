
-- Add a function to handle joining an event with transaction
CREATE OR REPLACE FUNCTION public.join_event(p_event_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert participation record
  INSERT INTO public.event_participants (event_id, user_id)
  VALUES (p_event_id, p_user_id);
  
  -- Update participant count atomically
  UPDATE public.events
  SET current_participants = current_participants + 1
  WHERE id = p_event_id;
END;
$$;

-- Add a function to handle canceling participation with transaction
CREATE OR REPLACE FUNCTION public.cancel_event_participation(p_event_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete participation record
  DELETE FROM public.event_participants
  WHERE event_id = p_event_id AND user_id = p_user_id;
  
  -- Update participant count atomically
  UPDATE public.events
  SET current_participants = GREATEST(1, current_participants - 1)
  WHERE id = p_event_id;
END;
$$;
