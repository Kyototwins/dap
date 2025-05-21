
-- Create or replace the function to set up the email digest job
CREATE OR REPLACE FUNCTION public.setup_email_digest_job()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  job_id text;
BEGIN
  -- Delete existing job if it exists
  PERFORM cron.unschedule('daily-email-digest-job');
  
  -- Schedule new daily job to run at 9:30 AM
  SELECT cron.schedule(
    'daily-email-digest-job',
    '30 9 * * *',  -- Run at 9:30 AM every day (cron format)
    $job$
      SELECT net.http_post(
        'https://yxacicvkyusnykivbmtg.supabase.co/functions/v1/send-daily-digest',
        '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4YWNpY3ZreXVzbnlraXZibXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NDY3MTYsImV4cCI6MjA1NTQyMjcxNn0.FXjSvFChIG5t23cDV5VKHEkl82Ki-pnv64PWQjcd6jQ"}',
        '{}'
      );
    $job$
  ) INTO job_id;
END;
$$;
