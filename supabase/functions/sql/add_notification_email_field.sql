
-- Create a function to add the notification_email field to profiles table
CREATE OR REPLACE FUNCTION public.add_notification_email_field()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  column_exists boolean;
BEGIN
  -- Check if the column already exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'notification_email'
  ) INTO column_exists;
  
  -- Add the column if it doesn't exist
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.profiles ADD COLUMN notification_email TEXT';
  END IF;
END;
$$;
