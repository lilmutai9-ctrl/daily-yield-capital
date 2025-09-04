-- Fix security issues by setting search_path for functions
CREATE OR REPLACE FUNCTION public.reset_daily_simulation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reset daily profits for all users if it's a new day
  UPDATE public.trading_simulations 
  SET daily_profit = 0,
      active_trades = FLOOR(RANDOM() * 5) + 3, -- Random active trades between 3-7
      simulation_date = CURRENT_DATE,
      updated_at = now()
  WHERE simulation_date < CURRENT_DATE;
END;
$$;

-- Fix search_path for update simulation profits function
CREATE OR REPLACE FUNCTION public.update_simulation_profits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  simulation_record RECORD;
  hours_since_update INTEGER;
  profit_increment NUMERIC;
BEGIN
  -- Update profits for all active simulations
  FOR simulation_record IN 
    SELECT * FROM public.trading_simulations 
    WHERE simulation_date = CURRENT_DATE
  LOOP
    -- Calculate hours since last update
    hours_since_update := EXTRACT(EPOCH FROM (now() - simulation_record.last_updated)) / 3600;
    
    -- Only update if more than 1 hour has passed
    IF hours_since_update >= 1 THEN
      -- Calculate profit increment (between $50-200 per hour)
      profit_increment := (RANDOM() * 150 + 50) * FLOOR(hours_since_update);
      
      -- Update the simulation data
      UPDATE public.trading_simulations 
      SET daily_profit = daily_profit + profit_increment,
          total_profit = total_profit + profit_increment,
          ai_trades_count = ai_trades_count + FLOOR(hours_since_update * (RANDOM() * 3 + 1)),
          last_updated = now(),
          updated_at = now()
      WHERE id = simulation_record.id;
    END IF;
  END LOOP;
END;
$$;