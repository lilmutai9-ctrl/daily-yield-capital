-- Create a function to update existing investments with correct durations based on user preferences
-- This is a one-time fix for investments created before plan details were captured

UPDATE public.investments 
SET 
  daily_rate = CASE 
    WHEN amount >= 1000 THEN 40  -- Diamond tier
    WHEN amount >= 500 THEN 35   -- Platinum tier  
    WHEN amount >= 100 THEN 30   -- Gold tier
    WHEN amount >= 50 THEN 25    -- Silver tier
    ELSE 20                      -- Starter tier
  END,
  plan_name = CASE 
    WHEN amount >= 1000 THEN 'Diamond Plan'
    WHEN amount >= 500 THEN 'Platinum Plan'  
    WHEN amount >= 100 THEN 'Gold Plan'
    WHEN amount >= 50 THEN 'Silver Plan'
    ELSE 'Starter Plan'
  END
WHERE plan_name = 'Standard Plan' OR daily_rate = 3.5;

-- For existing investments, we'll keep their current 30-day duration 
-- but update the rates and plan names to match their investment amount
-- Future investments will use the user's chosen duration