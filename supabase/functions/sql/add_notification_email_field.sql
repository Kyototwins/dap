
-- Create a function to add the notification_email and notification_time fields to profiles table
CREATE OR REPLACE FUNCTION public.add_notification_email_field()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  email_column_exists boolean;
  time_column_exists boolean;
BEGIN
  -- Check if the notification_email column already exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'notification_email'
  ) INTO email_column_exists;
  
  -- Check if the notification_time column already exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'notification_time'
  ) INTO time_column_exists;
  
  -- Add the email column if it doesn't exist
  IF NOT email_column_exists THEN
    EXECUTE 'ALTER TABLE public.profiles ADD COLUMN notification_email TEXT';
  END IF;
  
  -- Add the time column if it doesn't exist
  IF NOT time_column_exists THEN
    EXECUTE 'ALTER TABLE public.profiles ADD COLUMN notification_time TEXT DEFAULT ''09:00''';
  END IF;
END;
$$;
