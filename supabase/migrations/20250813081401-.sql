-- Create table to store configurable site settings
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  setting_description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
TO public
USING (true);

-- Insert default values for contact and payment settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_description) VALUES
-- Contact Details
('support_email', 'dailyyieldcapital@gmail.com', 'Primary support email address'),
('support_phone', '+1 (762) 203-5587', 'Primary support phone number'),
('telegram_link', 'https://t.me/daily_yield_capital', 'Telegram support channel link'),

-- Payment Addresses
('bitcoin_address', '1G34ANDa8vBWrUFd3Pz8aopxuYCcgfQ6kk', 'Bitcoin payment address'),
('ethereum_address', '0xd11334f91e89eef052dd2d6feb401f45c890639f', 'Ethereum payment address'),
('usdt_address', 'TPdhkjKLtYgVMDJKJGzaGgHZLcDjJsBx5J', 'USDT (TRC20) payment address'),

-- Company Details
('company_name', 'Daily Yield Capital', 'Company name'),
('company_description', 'Professional Forex, Crypto & Stock Investment Platform', 'Company tagline/description');

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();