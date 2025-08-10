-- Check current users and create profile + assign admin role for the current user
INSERT INTO public.profiles (user_id, first_name, last_name, phone)
VALUES ('63fe0591-d942-4236-9d7f-55933107cdfc', 'Admin', 'User', '')
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Assign admin role to this user
INSERT INTO public.user_roles (user_id, role)
VALUES ('63fe0591-d942-4236-9d7f-55933107cdfc', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;