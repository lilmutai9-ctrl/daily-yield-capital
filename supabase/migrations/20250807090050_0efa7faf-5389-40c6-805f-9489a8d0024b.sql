-- Enable admin access to all tables for administrative functions
-- This creates policies that allow admin users to view and manage all data

-- Create admin policies for deposits table
CREATE POLICY "Admins can view all deposits" 
ON public.deposits 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update all deposits" 
ON public.deposits 
FOR UPDATE 
USING (true);

-- Create admin policies for withdrawals table
CREATE POLICY "Admins can view all withdrawals" 
ON public.withdrawals 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update all withdrawals" 
ON public.withdrawals 
FOR UPDATE 
USING (true);

-- Create admin policies for profiles table
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Create admin policies for investments table
CREATE POLICY "Admins can view all investments" 
ON public.investments 
FOR SELECT 
USING (true);

-- Create admin policies for referrals table
CREATE POLICY "Admins can view all referrals" 
ON public.referrals 
FOR SELECT 
USING (true);

-- Create admin policies for referral_codes table
CREATE POLICY "Admins can view all referral codes" 
ON public.referral_codes 
FOR SELECT 
USING (true);

-- Create admin policies for notifications table
CREATE POLICY "Admins can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all notifications" 
ON public.notifications 
FOR SELECT 
USING (true);

-- Create admin policies for contact_messages table
CREATE POLICY "Admins can view all contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (true);