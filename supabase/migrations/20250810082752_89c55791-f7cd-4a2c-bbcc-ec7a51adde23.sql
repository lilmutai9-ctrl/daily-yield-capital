-- Check if there are any users with admin role
-- If not, we need to assign admin role to existing admin users
-- First, let's see what users exist
SELECT user_id FROM public.profiles LIMIT 5;

-- Let's also check if there are any user_roles entries
SELECT * FROM public.user_roles;

-- For immediate fix, let's create a function that auto-assigns admin role to the first user if no admins exist
CREATE OR REPLACE FUNCTION public.ensure_admin_exists()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_count INTEGER;
  first_user_id UUID;
BEGIN
  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin';
  
  -- If no admin exists, make the first profile user an admin
  IF admin_count = 0 THEN
    SELECT user_id INTO first_user_id 
    FROM public.profiles 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (first_user_id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
  END IF;
END;
$$;

-- Call the function to ensure at least one admin exists
SELECT public.ensure_admin_exists();