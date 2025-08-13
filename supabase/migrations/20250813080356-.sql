-- Add plan-related fields to deposits to capture user's chosen investment details
ALTER TABLE public.deposits 
  ADD COLUMN IF NOT EXISTS plan_name text,
  ADD COLUMN IF NOT EXISTS daily_rate numeric,
  ADD COLUMN IF NOT EXISTS duration_days integer;

-- Create trigger function to automatically create an investment when a deposit is approved
CREATE OR REPLACE FUNCTION public.create_investment_on_deposit_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_plan_name text;
  v_daily_rate numeric;
  v_duration_days integer;
  v_start_date timestamptz := now();
  v_maturity_date timestamptz;
BEGIN
  -- Only proceed if status transitioned to approved
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    v_plan_name := COALESCE(NEW.plan_name, 'Standard Plan');
    v_daily_rate := COALESCE(NEW.daily_rate, 3.5);
    v_duration_days := COALESCE(NEW.duration_days, 30);
    v_maturity_date := v_start_date + make_interval(days => v_duration_days);

    -- Create investment
    INSERT INTO public.investments (
      user_id,
      amount,
      daily_rate,
      start_date,
      maturity_date,
      total_earned,
      plan_name,
      status
    ) VALUES (
      NEW.user_id,
      NEW.amount,
      v_daily_rate,
      v_start_date,
      v_maturity_date,
      0,
      v_plan_name,
      'active'
    );

    -- Notify user
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      'Deposit Approved',
      'Your deposit has been approved and your investment is now active.',
      'success'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger on deposits updates
DROP TRIGGER IF EXISTS trg_create_investment_on_deposit_approval ON public.deposits;
CREATE TRIGGER trg_create_investment_on_deposit_approval
AFTER UPDATE OF status ON public.deposits
FOR EACH ROW
WHEN (NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM NEW.status))
EXECUTE FUNCTION public.create_investment_on_deposit_approval();