-- Enable the required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to process matured investments
CREATE OR REPLACE FUNCTION public.process_matured_investments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  investment_record RECORD;
  user_balance_record RECORD;
BEGIN
  -- Find all active investments that have reached maturity
  FOR investment_record IN 
    SELECT * FROM public.investments 
    WHERE status = 'active' 
    AND maturity_date <= NOW()
  LOOP
    -- Get or create user balance record
    SELECT * INTO user_balance_record 
    FROM public.user_balances 
    WHERE user_id = investment_record.user_id;
    
    IF NOT FOUND THEN
      -- Create balance record if it doesn't exist
      INSERT INTO public.user_balances (user_id, balance)
      VALUES (investment_record.user_id, investment_record.total_earned);
    ELSE
      -- Update existing balance
      UPDATE public.user_balances 
      SET balance = balance + investment_record.total_earned,
          updated_at = NOW()
      WHERE user_id = investment_record.user_id;
    END IF;
    
    -- Update investment status to completed
    UPDATE public.investments 
    SET status = 'completed',
        updated_at = NOW()
    WHERE id = investment_record.id;
    
    -- Create notification for user
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      investment_record.user_id,
      'Investment Matured',
      'Your ' || investment_record.plan_name || ' investment of $' || 
      investment_record.amount || ' has matured. $' || 
      investment_record.total_earned || ' has been added to your balance.',
      'success'
    );
    
    -- Log the activity
    INSERT INTO public.admin_activity_logs (
      admin_session,
      action_type,
      target_table,
      target_id,
      user_affected,
      amount,
      old_status,
      new_status,
      admin_notes
    ) VALUES (
      'system_automated',
      'investment_matured',
      'investments',
      investment_record.id,
      investment_record.user_id,
      investment_record.total_earned,
      'active',
      'completed',
      'Investment automatically matured and balance updated'
    );
  END LOOP;
END;
$$;