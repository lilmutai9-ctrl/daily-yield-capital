-- Create admin roles enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create user_balances table for manual balance adjustments
CREATE TABLE public.user_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    balance NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id)
);

-- Enable RLS on user_balances
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_balances
CREATE POLICY "Admins can view all balances" 
ON public.user_balances 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own balance" 
ON public.user_balances 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all balances" 
ON public.user_balances 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create balance_adjustments table for tracking manual adjustments
CREATE TABLE public.balance_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    admin_id UUID NOT NULL,
    previous_balance NUMERIC NOT NULL,
    new_balance NUMERIC NOT NULL,
    adjustment_amount NUMERIC NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on balance_adjustments
ALTER TABLE public.balance_adjustments ENABLE ROW LEVEL SECURITY;

-- RLS policies for balance_adjustments
CREATE POLICY "Admins can view all balance adjustments" 
ON public.balance_adjustments 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create balance adjustments" 
ON public.balance_adjustments 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating updated_at on user_balances
CREATE TRIGGER update_user_balances_updated_at
    BEFORE UPDATE ON public.user_balances
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin role (you'll need to replace with actual admin user ID)
-- This is a placeholder - you'll need to update with the actual admin user ID
-- INSERT INTO public.user_roles (user_id, role) VALUES ('your-admin-user-id', 'admin');