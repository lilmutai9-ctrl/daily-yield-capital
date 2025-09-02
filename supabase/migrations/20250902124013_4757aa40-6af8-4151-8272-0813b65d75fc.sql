-- Create a cron job to process matured investments every hour
SELECT cron.schedule(
  'process-matured-investments',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://vxobhvbcfoystjnkauqd.supabase.co/functions/v1/process-matured-investments',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4b2JodmJjZm95c3RqbmthdXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTc1MTIsImV4cCI6MjA2NzgzMzUxMn0.vYBRYYFscN1x2_9Pztqclyp22ozpwYwzPq4gXmmaFJQ"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Also update the total_earned field for investments based on daily calculations
-- This function calculates daily earnings and updates total_earned
CREATE OR REPLACE FUNCTION public.calculate_investment_earnings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  investment_record RECORD;
  days_active INTEGER;
  daily_earning NUMERIC;
  new_total_earned NUMERIC;
BEGIN
  -- Calculate earnings for all active investments
  FOR investment_record IN 
    SELECT * FROM public.investments 
    WHERE status = 'active'
  LOOP
    -- Calculate how many days the investment has been active
    days_active := EXTRACT(DAY FROM (NOW() - investment_record.start_date))::INTEGER;
    
    -- Calculate daily earning (amount * daily_rate / 100)
    daily_earning := (investment_record.amount * investment_record.daily_rate / 100);
    
    -- Calculate new total earned (but not exceeding maturity)
    new_total_earned := LEAST(daily_earning * days_active, daily_earning * EXTRACT(DAY FROM (investment_record.maturity_date - investment_record.start_date))::INTEGER);
    
    -- Update the total_earned field
    UPDATE public.investments 
    SET total_earned = new_total_earned,
        updated_at = NOW()
    WHERE id = investment_record.id 
    AND total_earned != new_total_earned; -- Only update if changed
  END LOOP;
END;
$$;

-- Schedule daily earnings calculation every 6 hours
SELECT cron.schedule(
  'calculate-daily-earnings',
  '0 */6 * * *', -- Every 6 hours
  $$
  SELECT public.calculate_investment_earnings();
  $$
);