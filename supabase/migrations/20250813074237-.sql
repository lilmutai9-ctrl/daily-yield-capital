-- Secure deposits UPDATE policy to require admin role
DROP POLICY IF EXISTS "Admins can update all deposits" ON public.deposits;

CREATE POLICY "Admins can update all deposits"
ON public.deposits
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));