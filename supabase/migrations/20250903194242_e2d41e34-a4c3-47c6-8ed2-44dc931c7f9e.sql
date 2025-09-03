-- Create trading simulation data table
CREATE TABLE public.trading_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  daily_profit NUMERIC NOT NULL DEFAULT 0,
  total_profit NUMERIC NOT NULL DEFAULT 0,
  active_trades INTEGER NOT NULL DEFAULT 0,
  ai_trades_count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  simulation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trading_simulations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own simulation data" 
ON public.trading_simulations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own simulation data" 
ON public.trading_simulations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulation data" 
ON public.trading_simulations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_trading_simulations_user_id ON public.trading_simulations(user_id);
CREATE INDEX idx_trading_simulations_date ON public.trading_simulations(simulation_date);

-- Create function to reset daily simulation data
CREATE OR REPLACE FUNCTION public.reset_daily_simulation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to update simulation profits based on time
CREATE OR REPLACE FUNCTION public.update_simulation_profits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create trigger for updated_at
CREATE TRIGGER update_trading_simulations_updated_at
BEFORE UPDATE ON public.trading_simulations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();