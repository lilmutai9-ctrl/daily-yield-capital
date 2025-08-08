-- Create admin activity logs table for tracking all admin actions
CREATE TABLE public.admin_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_session TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID NOT NULL,
  old_status TEXT,
  new_status TEXT,
  admin_notes TEXT,
  user_affected UUID,
  amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin activity logs
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all activity logs
CREATE POLICY "Admins can view all activity logs" 
ON public.admin_activity_logs 
FOR SELECT 
USING (true);

-- Create policy for admins to create activity logs
CREATE POLICY "Admins can create activity logs" 
ON public.admin_activity_logs 
FOR INSERT 
WITH CHECK (true);

-- Add index for better performance
CREATE INDEX idx_admin_activity_logs_created_at ON public.admin_activity_logs (created_at DESC);
CREATE INDEX idx_admin_activity_logs_target ON public.admin_activity_logs (target_table, target_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_admin_activity_logs_updated_at
BEFORE UPDATE ON public.admin_activity_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();