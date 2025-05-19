
-- Enable the pg_cron and pg_net extensions (run once)
create extension if not exists pg_cron schema extensions;
create extension if not exists pg_net schema extensions;

-- Schedule the job to run daily at 9:00 AM UTC
select
  cron.schedule(
    'daily-notification-digest-emails',
    '0 9 * * *',  -- Run at 9:00 AM UTC every day
    $$
    select
      net.http_post(
        url:='https://globalpals.supabase.co/functions/v1/send-digest-email',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_SERVICE_KEY"}'::jsonb,
        body:='{}'::jsonb
      ) as request_id;
    $$
  );

-- Note: Replace YOUR_SUPABASE_SERVICE_KEY with actual service key when deploying
-- This SQL script needs to be run directly in the Supabase SQL editor
