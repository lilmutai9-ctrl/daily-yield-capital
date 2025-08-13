-- Ensure RLS is enabled on investments
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Allow admins to insert investments on behalf of users
CREATE POLICY "Admins can create investments"
ON public.investments
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update any investment
CREATE POLICY "Admins can update investments"
ON public.investments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Explicitly allow system/service role to insert investments (redundant for service role but explicit)
CREATE POLICY "System can insert investments"
ON public.investments
FOR INSERT
TO public
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Explicitly allow system/service role to update investments
CREATE POLICY "System can update investments"
ON public.investments
FOR UPDATE
TO public
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');