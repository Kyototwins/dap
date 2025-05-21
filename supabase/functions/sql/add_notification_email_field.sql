
-- Function to add the notification_email field to the profiles table if it doesn't exist
CREATE OR REPLACE FUNCTION public.add_notification_email_field()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if notification_email column already exists in profiles table
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'notification_email'
  ) THEN
    -- Add the notification_email column
    EXECUTE 'ALTER TABLE public.profiles ADD COLUMN notification_email text DEFAULT NULL';
    RAISE NOTICE 'Added notification_email column to profiles table';
  ELSE
    RAISE NOTICE 'notification_email column already exists in profiles table';
  END IF;
END;
$$;
